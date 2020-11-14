# Bill splitter

Bill splitter is a web based application useful to track and split your expenses among friends.

## What does it do?
### Dashboard
Displays at a glance total debt, the pending dues with friends and non-settled expense groups. Options are also provided to settle dues by navigating to 'Friends' page and view detailed expenses by navigating to 'Groups' page.

### Friends
Displays a list of all the friends with option to see details of each friends. It also has an option to add a new friend and add a new expense. This page has following functionalities:

* **Clicking on a user in list**: User details are displayed with profile avatar, name, last update date, debt amount and groups that the friend belongs to
* **Settle button**: A button to settle the dues with that friend (with popup confirmation)
* **Remind button**: A button to remind the friend by opening telephone link (displayed only if that friend owes you and has a phone number)
* **Edit profile button**: Opens the new friend form modal with the selected friend's details pre-populated
* **Remove button**: A button to delete the friend from system only if there are no pending dues (with popup confirmation)
* **Add new friend**: A button to open form modal containing fields for name (mandatory), gender (mandatory), phone number (optional) and consent
* **Add expense**: A button to render form modal containing fields for selecting group, category, adding description, amount, who paid the amount and how it is split (list of all friends in the system). Submitting this form will add a new expense activity in the selected group and add the friend in that group if he/she is not already there

### Groups
Displays the list of all friends

## How is it built?

1. Javascript: All logic is written in Plain Javascript
2. HTML: All views are created with HTML templates
3. CSS: All styles are built on top of Bootstrap 4
4. Grunt: Used for linting, compiling and building the project
5. Firebase: Used for Database and hosting
