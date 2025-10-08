# Transcendence

## Contents
* [Coding](#coding-%EF%B8%8F)
   * [Common Rules](#common-rules)
     * [General Rules](#general-rules)
     * [How and why avoid using getters and setters](#how-and-why-avoid-using-getters-and-setters)
     * [File Organisation](#file-organisation)
   * [TypeScript](#typescript)
     * [Syntax](#syntax)
     * [Visibility](#visibility)
     * [Constructors](#constructors)
     * [Class Members](#class-members)
     * [Primitive Types](#primitive-types)
     * [Variables](#variables)
     * [Exceptions](#exceptions)
     * [Iterating objects](#iterating-objects)
     * [Iterating containers](#iterating-containers)
     * [Control flow statements & blocks](#control-flow-statements--blocks)
     * [Switch Statements](#switch-statements)
     * [Equality Checks](#equality-checks)
     * [Function Declarations](#function-declarations)
     * [Function Expressions](#function-expressions)
     * [Semicolon](#semicolon)
     * [Type and Non-nullability Assertions](#type-and-non-nullability-assertions)
     * [Member property declarations](#member-property-declarations)
     * [Enums](#enums)
     * [Modules](#modules)
     * [Exports](#exports)
     * [Imports](#imports)
     * [Type System](#type-system)
     * [Example](#example)
   * [SQLite](#sqlite)
     * [Syntax](#syntax)
     * [Create Table](#create-table)
     * [Insert Table](#insert-table)
     * [Select Query](#select-query)
   * [HTML](#html)
   * [CSS](#css)
   * [Solidity](#solidity)
* [Git Organisation](#git-organisation-)
   * [Start Project](#start-project)
   * [Commit Rules](#commit-rules)
   * [Log commands](#log-commands)
   * [Branch](#branch)
      * [Rules](#rules)
      * [Commands](#commands)
   * [Merge](#merge)
   * [Rebase](#rebase)
   * [Git Helper](#git-helper)
* [Links](#links)
   * [Convention](#convention)
   * [Utils](#utils)

## Coding ⌨️

### Common Rules

#### General Rules
- Names must be descriptive and clear to a new reader (scientific/technical names first, and if none exist, use computer science terms related to the problem).
- Do not use abbreviations that are ambiguous or unfamiliar to readers outside your project, and do not abbreviate by deleting letters within a word.
- Choose searchable names.
- It is a good practice to avoid using getters and mostly setters in general.
- Use a private/protected function whenever is possible.
- Never declare variables in public.
- Try to make functions less than 20 lines long.
- Line should not exceed 150 characters.
- Never more than 2 nested loop/conditional structures.
- Try to use 1 statement per loop (function call).
- A function must do only one thing and cannot be broken down into sections.
- Try to use `switch` and `if/else` statements only once, used to create polymorphic objects, and hidden behind an inheritance relationship so that the rest of the system cannot see them.
- Try to have a maximum of 3 arguments per function.
- Use classes or structures to reduce the number of arguments.
- Prefer using function returns over argument modification.
- Avoid passing a boolean value to a function.
- Try to write function names that facilitate argument ordering (for example, `assertExpectedEqualsActual(expected, actual)` instead of `assertEquals(expected, actual)` because `expected` and `actual` have the same type and should not be reversed).
- Separate commands and requests.
- Prefer exceptions to error code returns.
- Extract `try/catch` blocks using throws to have a single statement in `try/catch` and so that the function starts with the `try` and ends with the `catch`.
- Rather than using enums or classes for all error codes, use multiple classes inheriting from the `Exception` class : this will avoid recompilation when adding errors.

#### How and why avoid using getters and setters
Two example in pseudo code :
```ts
// Don't do
class Client {
    private server: Server

    checkPassword(clientPassword: text) {
        return (clientPassword == server.getPassword())// Client get the server password.
    }
}

class Server {
    private password: text

    getPassword() {
        return password
    }
}

// But do
class Client {
    private server: Server

    checkPassword(clientPassword: text) {
        return server.passwordIs(clientPassword)
    }
}

class Server {
    private password: text

    passwordIs(clientPassword: text) {
        return (clientPassword == password)
    }
}
```

```ts
// Don't do
class Enemy {
    private attackDamage: number

    attack(player: Player) {// Complicates the method.
        health = player.getHealth()
        if (health > 0)
        {
            newHealth = health - attackDamage
            if (newHealth < 0)
                newHealth = 0
            player.setHealth(newHealth)// Health leave the scope of Player.
        }
    }
}

class Player {
    private health: number

    getHealth() {
        return health
    }

    setHealth(health: number) {
        this.health = health
    }
}

// But do
class Enemy {
    private attackDamage: number

    attack(player: Player) {
        if (player.isAlive())
            player.takeDamage(attackDamage)
	}
}

class Player {
    private health: number

    isAlive() {
        return (health > 0)
    }

    takeDamage(damage: number) {
        health = health - damage
        if (health < 0)
            health = 0
    }
}
```

#### File Organisation
1. public/protected/private types (typedef, using, enum)
2. protected/private member declaration
3. Constructor/Destructor
4. Getters/Setters
5. Overload operator
6. Methods (public/protected/private) written in the read direction.

### TypeScript

#### Syntax

Style |	Category
--- | ---
UpperCamelCase | class / interface / type / enum / decorator / type / parameters
lowerCamelCase | variable / parameter / function / method / property / module alias
CONSTANT_CASE | global constant values, including enum values and static readonly property of a class

- Names must not start or end with `_`.

#### Visibility
- TypeScript symbols are public by default. Never use the public modifier except when declaring non-readonly public parameter properties (in constructors).

#### Constructors
- Constructor calls must use parentheses, even when no arguments are passed.
- Empty default constructor must not be define.

#### Class Members
- Variables mustn't start with `$`.
- Use `private` to private fields (and not `#`).
- Mark properties that are never reassigned outside of the constructor with the readonly modifier.
- If a class member is a constructor parameter, declare it in the constructor.
- If a class member is not a parameter, initialize it where it's declared, which sometimes lets you drop the constructor entirely.
- Always use `this` to access to class members.

#### Primitive Types
- `String`, `Boolean` and `Number` must not use constructor with hard values.
- Always use bracket notation to initialize `Array`, or `from` to initialize an `Array` with a certain size.

#### Variables
- Always use `const` or `let` to declare variables. Use `const` by default, unless a variable needs to be reassigned. Never use `var`.

#### Exceptions
- Always use `throw new Error(<...>)` (and not `throw Error(<...>)`).

#### Iterating objects
- Always use (`const` not mandatory) `for (const <...> of Object.keys(<...>))` or `for (const [<...>, <...>] of Object.entries(<...>))` (and not `for (<...> in <...>)`).

#### Iterating containers
- Always use (`const` not mandatory) `for (const <...> of <...>)` or `for (const [<...>, <...>] of <...>.entries()` (and not `for (<...> in <...>)`).
- Do not use `Array.prototype.forEach`, `Set.prototype.forEach`, and `Map.prototype.forEach`.

#### Control flow statements & blocks
- Control flow statements spanning one line never use `{}` for the containing code.
- Control flow statements spanning multiple lines always use `{}` for the containing code.
- `{` is always on the same line that the control flow statements and `}` is always on a new line.

#### Switch Statements
- All switch statements must contain a default statement group, even if it contains no code.
- Non-empty statement groups (case `<...>`) may not fall through (enforced by the compiler).
- Empty statement groups are allowed to fall through.

#### Equality Checks
- Always use `===` and `!==` (and not `==` and `!=`).
- `==` (or `!=`) can be use only with `null` to check if variable is (or is not) `null` or `undefined`.

#### Function Declarations
- Always use `function <name>(<param>) { <...> }` to declare function, and does not use arrow functions.
- Never use keyword `function` in class, interface, ... (keyword is deducted by TypeScript).

#### Function Expressions
- Always use arrow functions to define function parameter in other function, and does not use function expressions (defined with the `function` keyword).
- Never use function like parameter of other function, always use arrow functions which call the function.
- Arrow functions spanning one line always use `{}` if return value of the function is not used.
- Do not use `bind` in the expression that installs an event handler, because it creates a temporary reference that can't be uninstalled.

#### Semicolon
- Explicitly terminate all statements using a semicolon.

#### Type and Non-nullability Assertions
- Never use type assertions `(x as SomeType)` and non-nullability `assertions (y!)`.

#### Member property declarations
- Interface, class and inline object type declarations must use the `;` to separate individual member declarations.
- Always use `<var>.<property>` to access to properties and not `<var>["<property>"]`.

#### Enums
- Always use `enum` and not `const enum`.

#### Modules
- Your code must not use the `namespace Foo { ... }` construct.
- Code must not use `require` for imports.

#### Exports
- Do not use `default exports`.

#### Imports
Import type | Example | Use for
--- | --- | ---
module | `import * as <...> from "<...>";` | TypeScript imports
destructuring | `import {<...>} from "<...>";` | TypeScript imports
default | `import <...> from "<...>";` | Only for other external code that requires them
side-effect | `import "<...>";` | Only to import libraries for their side-effects on load<br>(such as custom elements)

- Code should fix name collisions by using a module import or renaming the exports themselves. Code may rename imports (import {<...> as <...>) if needed.
- use `import <...> from` or `export <...> from` and not `import type <...> from` or `export type <...> from`.

#### Type System
- Leave out type annotations for trivially inferred types: variables or parameters initialized to a string, number, boolean, RegExp literal or new expression.
- Always require return type annotations for functions and methods (except for setter).
- Type aliases must not include `|null` or `|undefined` in a union type.
- Use optional fields (`?`) on interfaces, classes and parameters rather than a `|undefined` type (for return function you can not use `?`, so use `|undefined` if necessary).
- For classes preferably avoid this pattern altogether and initialize as many fields as possible.
- Use an interface to define objects without functions, rather than using classes or a type annotations or type aliases (`type`).
- Array types are define with `var_name: type[]` if there is one type and `var_name: Array<type>` if there is multiple types (ex: `const a: string[]` and `const b: Array<string | number>`).
- Never use `any` type (use `unknown` as a last resort).
- `String`, `Boolean`, and `Number` have slightly different meaning from the corresponding primitive types `string`, `boolean`, and `number`. Always use the lowercase version.

#### Example
```ts
interface Person {
  name: string;
  age: number;
}
 
function greet(person: Person): string {
  const start = "Hello ";

  return start + person.name;
}
```
```ts
class Params {
  private static readonly MY_SPECIAL_NUMBER = 5;
  private readonly userList: string[] = [];

  constructor(private readonly x: number, protected y: number, private z: number) {}

  get getX(): number {
    return this.x;
  }

  set setY(value: number) {
    this.y = value;
  }

  private firstElement(arr: string[]): string | undefined {
    return arr[0];
  }
}
```

### SQLite

#### Syntax
- Use `''` for one line query and ` `` ` for multiple lines.
- Always use a new line for major keyword (SELECT, WHERE, JOIN, GROUP BY, ...) and put minor keyword (ASC, AND, AS, ON, ...) on the same line, except if line become too long.
- Always write major and minor keyword in UPPERCASE.
- Always finish a query with `;`.
- Each queries with data which can be read and write must start with `BEGIN` and finish with `COMMIT` to avoid datarace.

#### Create Table
```ts
db.exec(`
  CREATE TABLE [KEY_WORD] <table_name>(
    <key_name> <TYPE> PRIMARY KEY [KEY_WORD],
    [...],
    <value_name> <TYPE>,
    [...],
    FOREIGN KEY (<key_name>) REFERENCES <table_name>(<key_name>),
    [...]
  ) [STRICT];
`);
```

#### Insert Table
```ts
db.exec(`
  INSERT INTO <table_name> VALUES (<col1>[, <col2>, [...]]),
                                  (<col1>[, <col2>, [...]]),
                                  [...];
`);
```

#### Select Query
```ts
const query = db.prepare(`
  SELECT <select_data>
  FROM <table_name>
  [...];
`);
```
```ts
query.all();
query.get();
```

#### Create a Prepared Statement
A prepared query enables you to define the query syntax once and execute it multiple times with different values using the `prepare()` and `run()` functions.
```ts
const <prepared_statement_cmd> = db.prepare('<PREPARED_STATEMENT_CMD> <CMD_BODY>;');
```

### HTML

- Extension file is always `.html`.
- Default filename is always `index.html`.
- Always declare the document type as the first line in your document (`<!DOCTYPE html>`).
- Always add `<html>`, `<head>` and `<body>` tags.
- Always add `<title>` and `<meta>` in `<head>` tags.
- Always add `name` and `content` attribute in `<meta>` tag.
- Always define `lang` attribute of `<html>`.
- Never use CSS and TypeScript in HTML files (always call the file that contains CSS or TypeScript).
- Use lowercase element and attribute names.
- Close all HTML elements and use `<tag />` format for self-closing tag.
- Always quote attribute values (`<attribute>="<value>"`) .
- Always specify `alt`, `width` and `height` for images.
- Never spaces before and after equal sign.
- Avoid long code lines.
- Add blank lines to separate large or logical code blocks but do not add blank lines, spaces, or indentations without a reason.
- Add two spaces of indentation and never use the tab key.
- Short comments should be written on one line (`<!-- ... -->`).
- Comments that span more than one line, should be written with `<!--` and `-->` without comments.

### CSS

```css
<tag> {
  <property_name>: <property_value>;
  [...]
}
```

### Solidity
Style |	Category
--- | ---
UpperCamelCase | class / interface / type / enum / decorator / type / parameters
lowerCamelCase | variable / parameter / function / method / property / module alias
CONSTANT_CASE | global constant values, including enum values

- Names must not start or end with `_`.
- Braces are alone on their own line for conditions and functions (can be on the same line for the rest).

## Git Organisation 📜

### Start Project
- Define the rule of branch conflicts :
```bash
git config pull.rebase true
```

- Initialize graphical log :
```bash
git config --global alias.adog "log --all --decorate --oneline --graph"
```

### Commit Rules
- Merge/rebase on the `main` branch as soon as a feature is done.
- Merge/rebase on `main` must be made during certain time slots. Avoid doing so before lunch break or the end of the day and when no one is present. Above all, do not do so on Friday evenings or weekends.
- Always let mates know before merging/rebasing on `main` (to avoid multiple merges/rebases at the same time).
- Follow the commit format :
```bash
git commit -m '<KEY_WORD>(<feature>): <title>' [-m '<description>']
```

- Commit must relate to one thing. If two `KEY_WORD` are possible, maybe you should do two commits.

Type | KEY_WORD | Explain
--- | --- | ---
Base | `ADD`<br>`REMOVE` | Add new feature.<br>Remove useless feature.
Update | `UPDATE`<br>`REFACTO`<br>`PERF`<br> | Update an existing feature.<br>Completely change/reorganize an existing feature or the project architecture.<br>Update an existing feature to increase performance whitout change code logic.
Fix | `FIX`<br>`STYLE` | Fix a mistake.<br>Fix the formatting of the code whitout change code logic (norm).
Other | `WIP`<br>`DOCS`<br>`TEST` | Work In Progress.<br>Add or update documentation, like readme or comments (code is not changed)<br>Code relate to unit test.

- `feature` is the project part (broad or 	precise) relate to the commit (ex: front, back, game) :
  - in lowercase for a feature.
  - with the element's name for specific element like class or file.
  - `*` to refer to the entire project.
- `title` must be one short sentence (less than one line and ideally a half lines).
- `description` is optional, but it is recommended to detail the title.

### Log commands
Log
```bash
git log
```
Graphical log
```bash
git adog
```

### Branch
#### Rules
- A branch must be created for each feature.
- branch is always in lowercase.
- Assign a pull request for the base branch and create it for the specific branch.

#### Commands
See all branches in local (and what is the current branch)
```bash 
git branch
```
See all branches (and what is the current branch)
```bash 
git branch -a
```
Create a new branch `branch_name`
```bash
git branch <branch_name>
```
Remove a branch `branch_name` (before remove the local branch)
```bash
git push <remote> -d <branch_name>
```
Remove a local branch `branch_name` (think to switch on an other branch before)
```bash
git branch -d <branch_name>
```
Switch to a branch `branch_name`
```bash
git switch <branch_name>
```
Update a local branch
```bash
git switch <branch>
git pull
```
Update your branch with current `main`
```bash
git switch <branch_name>
git status
git push
git pull <remote> main
```
Remove local branch removed on github
```bash
git fetch --prune
```

### Merge
1. Switch to `main`
```bash
git switch main
```
2. Update the local `main`
```bash
git pull
```
3. Merge your work in `main`
```bash
git merge <branch_name>
```
4. Fix conflicts and check that everything is working properly

5. Add modifications
 ```bash
git status
git add <files>
``` 
6. Commit the modifications
```bash
git merge --continue
```
7. Push modification
```bash
git push
```

To cancel a merge (cancel at the last `--continue`)
```bash
git merge --abort
```

### Rebase
1. Switch to `main`
```bash
git switch main
```
2. Update the local `main`
```bash
git pull
```
3. Rebase your work in `main`
```bash
git rebase <branch_name>
```
> [!WARNING]
> if `main` contains a merge commit that's not present on your current branch, use `git rebase <branch_name> --rebase-merges` to preserve the branch structure during rebase.

4. Fix conflicts

5. Add modifications
 ```bash
git status
git add <files>
``` 
6. Pass to the next commit
```bash
git rebase --continue
```
7. Push modification
```bash
git push
```
8. If push is not working, check if local `main` has its old commit and all rebase commits :
```bash
git adog
```
9. Call a mate to validate.
10. Force the push (dangerous) :
```bash
git push --force-with-lease
```

To cancel a rebase (cancel at the last `--continue`)
```bash
git rebase --abort
```

### Git Helper
Change the message of the last commit
```bash
git commit --amend
```
Cancel the last commit (go back just before validate the last commit)
```bash
git reset --soft HEAD~1
```
Remove the last commit (remove commit and modifications)
```bash
git reset --hard HEAD~1
```
View logs and hide logs
```bash
git reflog
```
Merge the last `n` commits into a single commit.
1. Define the number of last commits to change
```bash
git rebase -i HEAD~<n>
```
2. Change the `n-1` last commit from `pick` to `squash`
3. Quit Vim (Echap and :x)
4. Give name to the new commit which contains merge commits
5. Push
  - If the commit was not pushed
```bash
git push
```
  - **If the commit was pushed.**, force push to apply modifications
```bash
git push --force-with-lease
```

## Links
### Convention
- TypeScript : https://ts.dev/style/
- SQLite : https://nodejs.org/api/sqlite.html
- HTML : https://www.w3schools.com/htmL/html5_syntax.asp
- CSS : https://www.w3schools.com/css/css_syntax.asp

### Utils
- Figma : https://www.figma.com/design/wg7bGU0KpypDmY3oOYij7i/Squelette?node-id=0-1&t=qWQYNu3hxw5eczve-1
- Excalidraw : https://excalidraw.com/#room=5d70f3e7c32fd3e972c9,rHn_zBCNQYGJspL2u9MZBQ
- Google Sheets : https://docs.google.com/spreadsheets/d/1ktLkwKtNEt1qTSRgfhirjpgNRBK502MYdi7dMi4ijN4/edit?usp=sharing
