"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const serialazeTransaction = (obj) => {
  const serialazed = { ...obj };

  if (obj.balance) {
    serialazed.balance = obj.balance.toNumber();
  }
  if (obj.amount) {
    serialazed.amount = obj.amount.toNumber();
  }

  return serialazed;
};

export async function createAccount(data) {
  try {
    const { userId } = await auth();

    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });

    if (!user) throw new Error("User not found");

    // convert balance to float before saving
    const balanceFloat = parseFloat(data.balance);
    if (isNaN(balanceFloat)) throw new Error("Invalid balance value");

    // check if this is the user's first account
    const existingAccount = await db.account.findMany({
      where: {
        userId: user.id,
      },
    });

    const shouldBeDefault =
      existingAccount.length === 0 ? true : data.isDefalut;

    // if this account should be default, set all other accounts to not default
    if (shouldBeDefault) {
      await db.account.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    // create the account
    const account = await db.account.create({
      data: {
        ...data,
        userId: user.id,
        balance: balanceFloat,
        isDefault: shouldBeDefault,
      },
    });

    const serialazedAccount = serialazeTransaction(account);

    revalidatePath("/dashboard");

    return { success: true, data: serialazedAccount };
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getUserAccounts() {
  const { userId } = await auth();

  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (!user) throw new Error("User not found");

  const accounts = await db.account.findMany({
    where: { userId: user.id },
    orderBy: { createdAt : "desc" },
    include: {
        _count: {
            select: {
                transactions: true,
            }
        }
    }
  })
  const serialazedAccount = accounts.map(serialazeTransaction);
  
  return serialazedAccount;

}

export async function getDashboardData() {
  const { userId } = await auth();

  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (!user) throw new Error("User not found");

  const transactions = await db.transaction.findMany({
    where: { userId: user.id },
    orderBy: { date : "desc" },
  });

  return transactions.map(serialazeTransaction);
}