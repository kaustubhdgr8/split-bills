# Bill splitter

Bill splitter is a web based application useful to track and split your expenses among friends.

## What does it do?
### Dashboard
Displays at a glance total debt, the pending dues with friends and non-settled expense groups. Options are also provided to settle dues by navigating to 'Friends' page and view detailed expenses by navigating to 'Groups' page.

### Friends
Displays a list of all the friends with option to see details of each friends. It also has an option to add a new friend and add a new expense. This page has following functionalities:

* **Clicking on a user in the list**: User details are displayed with profile avatar, name, last update date, debt amount (green for amount your friend owes you and red for amount you owe your friend) and groups that the friend belongs to
* **Settle button**: A button to settle the dues with that friend (with popup confirmation)
* **Remind button**: A button to remind the friend by opening telephone link (displayed only if that friend owes you and has a phone number)
* **Edit profile button**: Opens the new friend form modal with the selected friend's details pre-populated
* **Remove button**: A button to delete the friend from system only if there are no pending dues (with popup confirmation)
* **Add new friend**: A button to open form modal containing fields for name (mandatory), gender (mandatory), phone number (optional) and consent
* **Add expense**: A button to render form modal containing fields for selecting group, category, adding description, amount, who paid the amount and how it is split (list of all friends in the system). Submitting this form will add a new expense activity in the selected group and add the friend in that group if he/she is not already there

_The grand total of the amount you owe or you are owed is always shown on top with red or green color respectively._

### Groups
Displays the list of all groups with option to see details of each group. It also has an option to add a new group and add a new expense. This page has following functionalities:

* **Clicking on a group in the list**: Group details are displayed with group type icon, name, last update date, total expense in that group, list of friends with their dues in that group and expense activity.
* **Edit button**: Opens the new group form modal with the selected group's details pre-populated
* **Delete**: A button to delete a group only if the group is settled (with popup confirmation)
* **Friends tab**: Shows the number of friends in that group along with their list containing dues for each - green for amount your friend owes you and red for amount you owe your friend
* **Settle button**: A button to settle the dues with that friend for the group (with popup confirmation)
* **Remove button**: A button to delete the friend from system only if there are no pending dues (with popup confirmation)
* **Activity tab**: Shows the number of expenses tracked in that group along with their list containing details of each expense:
  * Category, icon and name of the expense
  * Total amount of the expense and name of person who paid it
  * Debt amount - green if you lent, red if you borrowed
  * List of friends among whom that expense is split
* **Record expense button**: A button to render form modal containing fields for selecting category, adding description, amount, who paid the amount and how it is split (list of all friends in the group). Submitting this form will add a new expense activity in the group and split among the selected friends
* **Add new member button**: Opens a form modal with the multiselect list of all friends in the system. Submitting the form will add the selected friends, intelligently ignoring already existing friends if selected
* **Add new group**: A button to open form modal containing fields for name (mandatory), group type (mandatory) and consent
* **Add expense**: A button to render form modal containing fields for selecting group, category, adding description, amount, who paid the amount and how it is split (list of all friends in the system). Submitting this form will add a new expense activity in the selected group and add the friend in that group if he/she is not already there

_The grand total of the amount you owe or you are owed is always shown on top with red or green color respectively._

## How is it built?

* Javascript: All logic is written in Plain Javascript
* HTML: All views are created with HTML templates
* CSS: All styles are built on top of Bootstrap 4
* Grunt: Used for linting, compiling and building the project
* Firebase: Used for Database and hosting

## How to run it?

```
npm install
grunt
firebase emulators:start
```

## What next?
Displaying charts based on expense categories and dues
