package shared

var (
	ErrKeyword         = "error"
	ErrWrongInputs     = "you have entered wrong input"
	ErrBadRequest      = "user bad request"
	ErrNotFoundUser    = "user is not found"
	ErrListingUsers    = "cannot find any users"
	ErrAddingUser      = "new user cannot be added"
	ErrUpdatingUser    = "user cannot be updated"
	ErrDeletingUser    = "user cannot be deleted"
	ErrAddingIncome    = "income cannot be added"
	ErrUpdatingIncome  = "income cannot be updated"
	ErrDeleteIncome    = "income cannot be deleted"
	ErrListingIncomes  = "incomes cannot be listed"
	ErrAddingExpense   = "expense cannot be added"
	ErrUpdatingExpense = "expense cannot be updated"
	ErrDeletingExpense = "expense cannot be deleted"
	ErrListingExpenses = "expenses cannot be listed"
	OkKeyword          = "ok"
	OkAddingUser       = "user added successfully"
	OkUpdatingUser     = "user updated successfully"
	OkDeletingUser     = "user deleted successfully"
	OkAddingIncome     = "income added successfully"
	OkUpdatingIncome   = "income updated successfully"
	OkDeletingIncome   = "income deleted successfully"
	OkAddingExpense    = "expense added successfully"
	OkUpdatingExpense  = "expense updated successfully"
	OkDeletingExpense  = "expense deleted successfully"
)

var Roles = []string{"admin", "user"}
