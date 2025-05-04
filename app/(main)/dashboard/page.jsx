import { getDashboardData, getUserAccounts } from '@/actions/dashboard'
import CreateAccountDrawer from '@/components/create-account-drawer'
import { Card, CardContent } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import React, { Suspense } from 'react'
import AccountCard from './_components/account-card'
import { getCurrentBudget } from '@/actions/budget'
import BudgetProgress from './_components/budget-progress'
import DashboardOverview from './_components/transaction-overview'

const DashboardPage = async () => {

const accounts = await getUserAccounts();

const defaultAccount = accounts?.find((account) => account.isDefault);

let budgetData = null;
if(defaultAccount) {
    budgetData = await getCurrentBudget(defaultAccount.id);
}

const transactions = await getDashboardData();

  return (
    <div className='space-y-8'>
        
        {/* Budget Progress */}
        {
            budgetData && (
            <BudgetProgress 
                initialBudget={budgetData?.budget}
                currentExpenses={budgetData?.currentExpenses || 0} 
            />)
        }

        {/* Dashboard Overview */}
        <Suspense fallback={"Loading Overview..."}>
            <DashboardOverview 
                accounts={accounts}
                transactions={transactions || []}
            />
        </Suspense>

        {/* Account Grids */}
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
            <CreateAccountDrawer>
                <Card className="hover:shadow-lg transition-shadow duration-300 ease-in-out cursor-pointer border-dashed">
                    <CardContent className="flex flex-col items-center justify-center h-full text-muted-foreground pt-5">
                        <Plus className='w-10 h-10 mb-2' />
                        <p className='font-medium text-sm'>Add New Account</p>
                    </CardContent>
                </Card>
            </CreateAccountDrawer>

            { accounts.length > 0 && accounts?.map((account) => {
                return (
                    <AccountCard key={account.id} account = {account} />
                )
            })}

        </div>


    </div>
  )
}

export default DashboardPage