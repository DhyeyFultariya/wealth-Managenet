"use client";

import { updateDefaultAccount } from "@/actions/accounts";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import useFetch from "@/hooks/use-fetch";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react";
import { toast } from "sonner";

const AccountCard = ({ account }) => {
  const { name, id, balance, type, isDefault } = account;

  const {
    loading: updateDefaultLoading,
    fn: updateDefaultFn,
    data: updateAccount,
    error,
  } = useFetch(updateDefaultAccount);

  const handleDefalutChange = async (event) => {
    event.preventDefault();

    if(isDefault) {
        toast.warning("You need at least one default account")
        return;
    }

    await updateDefaultFn(id);

  }

  useEffect(() => {

    if(updateAccount?.success) {
        toast.success("Default account updated successfully");
    }
    
  }, [updateAccount, updateDefaultLoading]);

  useEffect(() => {

    if(error) {
        toast.error(error.message || "Something went wrong");
    }
    
  }, [error]);
  

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 ease-in-out cursor-pointer group relative">
      <Link href={`/account/${id}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium capitalize">{name}</CardTitle>
          <Switch checked={isDefault} onClick={handleDefalutChange} disabled={updateDefaultLoading} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ₹{parseFloat(balance).toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground">
            {type.charAt(0) + type.slice(1).toLowerCase()} Account
          </p>
        </CardContent>
        <CardFooter className="flex justify-between text-sm text-muted-foreground pt-4">
          <div className="flex item-center">
            <ArrowDownLeft className="mr-1 h-4 w-4 text-green-500" />
            Income
          </div>
          <div className="flex item-center">
            <ArrowUpRight className="mr-1 h-4 w-4 text-red-500" />
            Expenses
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default AccountCard;
