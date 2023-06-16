# For a good use of git - English

## Instructions

Working branches :
- The branch `main` is always tested and should be working, when branch `dev` is working and pass the tests, we push the work on `main`.
- The branch `dev` is merged with the differents features branches linked to it but is not stable.
- The branches with features are explained below.

Before creating a new branch, open an issue in the backlog project team, write a task into "A faire". Click on the three little dots beside `Draft` and choose the project. Then have a short description. You can write details, assign yourself or somebody else (or let it blank for somebody's assigning theyselves on the taks). Choose a priority and don't forget to actualize it's column.

Accroding on a way of naming modifications branches :
`#ticket_number-code-feature_title`
- ticket_number: the number of the issue on github.
- code: the first letter of your first name, with F for Front, B for Back, O for Other
- feature_title: short description for the feature

Examples :
- `#1-AF-NavBar-Adding-Title` : Ticket number 1 about the NavBar, edit by Antoine on the Frontend.
- `#5-LF-NavBar-Edit-Design` : Ticket number 5 about NavBar, edit by Lucas on the Frontend.
- `#2-IO-Docker-Compose-Structure` : Ticket number 2 on Docker-Compose, edit by Ivan.
- `#7-BFB-User-Profile-Routes` : Ticket number 7 on the User Profile routes, edit by Ben on the Frontend and Backend.
- Warning: The number should correspond to your issue's number on github.

## Commands

Before working! Don't forget to pull the `main` branch, and not the `dev` branch that is not necessarly working.

### Start with the `main` branch
`git checkout main`
`git fetch origin`
`git reset --hard origin/main`

### Create a new branch
`git checkout -b #x-feature`

### Update, add, commit and push changes
`git status`
`git add .`
`git commit -m "your message"`

### Push feature branch to remote. It's important to do this for viewing the differents commits of the branch once it'll be deleted.
### After pushing with -u flag, you can simply `git push` to your branch the next times.
`git push --set-upstream origin #x-feature` ou `git push -u origin #x-feature`

### When we want to merge our branch with the `dev` branch
- Go on Github.com, into the project, choose our current branch.
- Click on `Contribute`, then `Open Pull Request`.
- To the right, choosing the reviewer.
- CHOOSE BRANCH `dev`. Fill the form, then `Create Pull Request`.
- (If no conflicts, click `Merge Pull Request`)
- (Reviewer: `commit`, `merge`, then `delete branch` from github's interface)

## Usefull memo

### Delete the branch from the distant repo
`git push origin --delete #x-feature`

### Delete a branch in local mode
`git branch -D #x-feature`

### List all the branches in local mode
`git branch`

### List all the branches of the distant repo
`git branch -a`

------------

# Pour un bon usage de git - Français

## Instructions

Les branches fonctionnelles :
- La branche `main` est toujours testée et doit être continuellement en train de fonctionner, lorsque la branche `dev` fonctionne et passe les tests, pousser les changement sur `main`.
- La branche `dev` reçoit les modifications récentes des branches features liées mais ne fonctionne pas forcement.
- Les branches qui apportent des modifications sont expliquées ci-dessous.

Avant de créer une nouvelle branche, ouvrir une issue dans le panneau projet équipe, écrire une tâche dans "A faire". Cliquer du les trois petits points à coté de `Drafts` et choisir le projet. Puis écrire une courte description. Vous pouvez écrire des details, assigner vous meme ou quelqu'un d'autre (ou laissez vide si vous voulez que quelqu'un s'approprie la tâche). Choisir une priorité, et n'oubliez pas d'actualiser sa colonne!

Accordons-nous sur une manière de nommer les branches de modification :
`#numero_ticket-code-titre_fonctionnalité`
- numero_ticket: le numero de l'issue sur le github.
- code: la premiere lettre de votre prenom, avec F pour Front, B pour Back, O pour Other.
- titre_fonctionnalité: courte description de la modification.

Exemples :
- `#1-AF-NavBar-Adding-Title` : Ticket numéro 1 sur la barre de navigation, pris en charge par Antoine sur le Front.
- `#5-LF-NavBar-Edit-Design` : Ticket numéro 5 sur la barre de navigation, pris en charge par Lucas sur le Front.
- `#2-IO-Docker-Compose-Structure` : Ticket numéro 2 sur Docker Compose, pris en charge par Ivan.
- `#7-BFB-User-Profile-Routes` : Ticket numero 7 sur les routes des profils utilisateur, pris en charge par Ben sur le Front et le Back.
- Attention: Le numéro sur votre branche doit correspondre au numéro de votre ticket.

## Commandes

Avant de travailler! N'oubliez pas de pull le `main`, et non la branche `dev` qui n'est pas forcement celle qui fonctionne.

### Commencer avc la branche `main`
`git checkout main`
`git fetch origin`
`git reset --hard origin/main`

### Créer une nouvelle branche
`git checkout -b #x-feature`

### Mettre à jour, ajouter, commit et pousser des changements.
`git status`
`git add .`
`git commit -m "your message"`

### Pousser des fonctionnalités sur la branche en remote. C'est important de faire ceci pour voir les précedents commits de la branche une fois qu'elle sera supprimée.
### Après avoir poussé avec le flag -u, vous pouvez simplement `git push` votre branche les fois d'après.
`git push --set-upstream origin <new_branch>` ou `git push -u origin <new_branch>`

### Une fois qu'on veut fusionner notre branche avec la branche `dev`
- Aller sur Github.com, dans le projet, se rendre sur sa branche
- Cliquer sur `Contribute`, puis `Open Pull Request`.
- A droite, choisir le reviewer.
- Remplir le formulaire, puis `Create Pull Request`.
- (Si pas de conflits, faire `Merge Pull Request`)
- (Reviewer: commit, merge, puis delete branch depuis l'interface)

## Memo utile

### Supprimer la branche du repo distant
`git push origin --delete <branch_name>`

### Supprimer une branche en local
`git branch -D <branch_name>`

### Lister les branches en local
`git branch`

### Lister les branches sur le dépot distant
`git branch -a`