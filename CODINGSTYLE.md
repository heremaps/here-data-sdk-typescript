# Overview

This document is a guide to our coding style and conventions.

We try to have reasonable rules and follow them to the best of our capabilities to:

1. Have clear code.
1. Ease the maintenance and reusability.
1. Limit discussions about how to write and what to write in commits, comments, and code so that code reviews focus on the essentials.
1. Get overall better developer experience.

If you have suggestions, please see our [contribution guidelines](CONTRIBUTING.md) and feel free to make a pull request.

---

## Good practices

1. Use the advantages of TypeScript typings as much as possible. Type your code. Avoid `any` types unless it is specifically meant to be the `any` type.
1. JavaScript/TypeScript is very flexible in many ways, so use them wisely, but try to think in a more C++ way and concepts of `const methods` and `variables`, `private` and `public`. Be careful when passing around objects as they are references.
1. Use the simplest tool for the job: `function` vs. `object/namespace/module` vs `class`.
1. Follow еру [SOLID design principles](https://dev.to/samueleresca/solid-principles-using-typescript):
   - Create classes and functions with **S**ingle responsibility.
   - Create classes and functions **O**pen for an extension by identifying customization points and Closed for modification by making small parts well-defined and composable.
   - Create classes that lend to the **L**iskov substitution principle. Use abstract interfaces for dynamic customization points. Preserve interface semantics and invariants, don't strengthen pre-conditions and don't weaken post-conditions.
   - Create narrow, segregated **I**nterfaces so that the caller doesn't depend on concepts outside of its domain.
   - Create customization points by accepting **D**ependencies through abstract interfaces. Give dependencies to objects explicitly instead of pulling them implicitly from the inside.
1. Include responsibility and collaborators within the documentation.
   The responsibility description must be as simple as a single sentence without conjunctions. If it's not expressible like that, it's a hint that such a class has multiple responsibilities. Documentation also includes potential users and dependencies of the class, and it's a connection to them. Check the `Documentation` section below for more details.
1. Avoid implementation inheritance. Use composition instead.
   Inherit not to reuse but to be reused. Implementation inheritance is usually used to reduce effort, not because it's solving a problem. It's creating a problem of implicit dependencies and fragile base classes. Specific implementations of an interface should be created from helpers through composition and marked as final to prevent further derivation.
1. Keep interfaces pure by avoiding data members. If an interface has a data member, it's no longer abstract. Derived classes can't get rid of them and need to pay the cost in object size. Keep interfaces narrow and pure.
1. Keep performance and memory consumption in mind.

   - Try not to create many temporary objects. Otherwise, the garbage collector kicks in and might freeze the process.
   - Prefer, for example, an object of arrays over an array of objects.
   - Prefer _result_ and _scratch variables_, for example:

     ```javascript
     function add( Vector a, Vector b, Vector result) {
         result.x = a.x + b.x;
         result.y = a.y + b.y;
         result.z = a.z + b.z;
     }
     ```

1. Workers run in their context, and every object passed to a worker is a copy and loses all prototype and function information. So all these must be reconstructed on the worker, and it is very time-consuming. Keep in mind that **only** `ArrayBuffer` and `MessagePort` are transferable objects as defined in the specification. Therefore, to communicate with Workers, prefer only to use `ArrayBufferLike`.
1. Although we are using an object-oriented approach, use it in a TypeScript/JavaScript way.
   For example, in Type/JavaScript, not everything needs to be a class. When defining a singleton, use a namespace or module instead of a class, so it cannot be instantiated, and you can provide your create method.
1. Avoid adding additional libraries. We want to keep the `SDK` as slim as possible.
1. Avoid truthy/falsy statements. For information on how to avoid the scary mess of JavaScript truthy and falsy statements, see the [related article](https://www.sitepoint.com/javascript-truthy-falsy/) on SitePoint.

   - Following such an approach improves safety, the impression that we know what kind of type the operator has, and the impression on the reader that we are not lazy.
   - When choosing between converting to real Boolean values and using strict equality (===) or inequality (!==) on more complex objects use the former.

   ```typescript
   if (someNonBooleanVariable !== undefined)
   ```

1. _Do not use `!!` in your code_. The !!_trick_ is just a way to make a truthy operation a boolean one, but the issue with truthiness is _not solved_ but _hidden_. Consider the following example:

   ```typescript
   let str = undefined
   !!str // is false even when undefined

   let str = ""
   !!str // is false even when the string has 0 length

   if (str === undefined || str.length ===0)
   ```

   Here is a way how not to use `!!` (based on [this](https://stackoverflow.com/questions/784929/what-is-the-not-not-operator-in-javascript/1406618#1406618)):

   ```typescript
   // !! is a horribly obscure way to do a type conversion.
   // ! is NOT.
   // !true is false,
   // !false is true
   // !0 is true, and !1 is false.

   // So you convert a value to a boolean, then invert it, and then invert it again.

   // Maximum Obscurity:
   let val.enabled = !!userId;
   let this.pauseButton:HTMLElement = new HTMLElement();

   // Much easier to understand:
   let val.enabled = (userId != 0);

   if (this.pauseButton !== undefined) {
   // ...
   }
   ```

1. Usage of "Non-null assertion operator" in the code. Don't use it when declaring members which are not initialized (if needed use optional operator instead: `?`).

   ```typescript
   // Don't use ! to overcome TypeScript strict initialization rule.

   export class FeatureGroup {
       /* Optional indices */
       layerIndex!: number[];
   ```


    // Use optional operator instead.
    export class FeatureGroup {
        /* Optional indices */
        layerIndex?: number[];
    ```

1. If form the code logic you are sure the variable is not null at a given point of execution, use `!` locally (as close to the invocation as possible).

   ```typescript
   // If there is a justified need to use ! operator, keep it as close to the invocation as possible.
   if (this.storeExtendedTags) {
     featureGroup.layerIndex![featureGroup.numFeatures] = this.addLayer(
       env.lookup("$layer")
     ); // Mind the ! near layerIndex.
   }
   ```

1. Prefer the `for` loops over the `forEach` functions. Iterables are nice for the readability of `#reduce`, `#map`, `#filter`, `#find`, and the like, but impact performance by creating a new function.
1. Use PascalCase for file names.
1. Use PascalCase for class and namespace names. For example, `ClassName`, `NamespaceName`.
1. Use camelCase for method names. For example, `ClassName.methodName`.
1. Use camelCase for public class members. For example, `classMember`.
1. Use camelCase prefixed by `m_` for private properties.
1. Don't use `public` in TypeScript, as it's implicit and should be not used for methods and properties
1. Use PascalCase for enum names. For example, `ExampleEnum`.
1. Use PascalCase for file names of modules. For example, `MapView.ts`.
1. Use UpperCase for global constants. For example:

   ```typescript
   static readonly GRID_SIZE = 3;
   const RAD2DEG = 180.0 / Math.PI;
   // !! local const variable should be named like other member variables in camelCase.
   ```

1. User lower-case package names with a dash separator. For example, `olp-sdk-data-service-read` or `olp-sdk-fetch`.
1. Add a lib and a test folder to the package. For example, `mapview/lib` and `mapview/test`
1. Always declare types as interfaces.
1. Make sure to differentiate between the two types of interfaces: used as a type and implemented as classes.
1. Use PascalCase for the Type interfaces, such as `interface Style {}`.
1. Use "I" +PascalCase for Class interfaces, such as `interface ILogger {}`.
1. Use PascalCase for the enum name and types. For example:

   ```typescript
   export enum BillboardType {
     None = 0,
     Spherical = 1,
     Cylindrical = 2
   }
   ```

1. For Options or Enums related to a class, begin the name with the PascalCase class name. For example, `MapViewOptions`, `enum DecodedTileMessageType`.
1. Define class properties at the top of the class or in the constructor that should be the first call after the properties. For example:

   ```typescript
   class Foo {
       private readonly a: boolean = true;
       private readonly b: boolean = true;

       constructor(private readonly c: boolean) { }
       function bar(): void { }
    }
   ```

1. When you implement a new code, make sure to compile the code according to the TypeScript `strictPropertyInitialization` rule, without making class members optional ("`!`"). If member objects must have a complex setup, follow these guidelines:
   - Wherever possible, create the properties in the constructor.
   - If applicable, create private `setupXYZ` methods.
   - Instead of the `setupXYZ` methods, it might be possible to create a subclass of the object and initialize the members there.
   - Consider applying [Carmack's "good judgment"](http://number-none.com/blow/john_carmack_on_inlined_code.html) by breaking this rule ONLY if it is necessary.
1. Use `undefined`; don't use `null`. Inspired by the [Null and Undefined](https://github.com/Microsoft/TypeScript/wiki/Coding-guidelines#null-and-undefined) section of the TypeScript Coding Guidelines.

## Formatting

- Formatting rules are defined in the `tslint.json` file contained in the development environment.
- Indentation rules are defined in the `.prettierrc.json` file contained in the development environment.
- A useful formatting plugin is Visual Studio Code "prettier" extension.

## Visual Studio Code сonfiguration

To configure the VSCode:

1. Go to **File** > **Preferences** > **Settings**.
2. On the **User Settings** tab, apply the following settings:

```json
    "editor.renderWhitespace": "all",
    "editor.rulers": [
        100
    ],
    "editor.trimAutoWhitespace": true,
    "editor.wordWrapColumn": 100,
    "editor.formatOnType": true,
    "editor.formatOnSave": false,
    "[typescript]": {
        "editor.formatOnSave": true
    },
    "[javascript]": {
        "editor.formatOnSave": true
    }
    "files.eol": "\n",
    "files.trimTrailingWhitespace": true,

    "prettier.tabWidth": 4,
    "prettier.printWidth": 100,

    "tslint.alwaysShowStatus": true,
    "tslint.alwaysShowRuleFailuresAsWarnings": false,
    "tslint.enable": true,
```

## Commit message

The purpose of a commit message is to summarize the scope and context of a patch for maintainers and potential reviewers.

1. Be terse.

   Writing a good commit message is an exercise in stripping unnecessary words and leaving only the bare essence.

1. Use _present tense imperative_ to describe what the patch does to the codebase.

   For example, use "add" instead of "adding" or "added" in the following sentence: "Add function to triangulate a monotone polygon."

1. Insert a blank line between the commit title and the rest of the message.

1. Optionally, provide a summary of what changes are part of the patch.

   Ideally, a commit message should consist of imperative sentences. For complex changes, a more elaborate explanation is acceptable.

1. Split unrelated changes into multiple patches.

   Bug fixes should always be committed separately so that they can be cherry-picked.

## Documentation

1. Write your comments in a `typedoc` compliant way.

1. Document the single responsibility of a class or function.

   If you notice that the description is too complicated, it could be a sign that the construct is doing too many things and should be split up.

1. Avoid documenting the obvious.

   For example, for the `enableProfiling()` method, don't add a brief section that this method enables profiling.

1. If you have to leave "TODO" comments in the code, make sure that they include a related ticket number so that the work is tracked and not forgotten.

## Recommended TypeDoc style

1. Write proper English sentences.
1. Put a period "." at the end of a line or sentence.
1. Write abbreviations in uppercase: HTML, HTTP, WHATWG.
1. Add proper external references: `... [WHATWG fetch](https://fetch.spec.whatwg.org/) ...`
1. Refer to other classes/interfaces with proper markdown links. To refer to a class named "Headers", write the link: `[[Headers]]`.
1. Refer to the current class with backquote/backticks: `` `CancellationToken` ``.
1. Write constants and other values, as well as function calls with backticks. For example, `` `true` `` instead of just "true", `` `cancel()` `` instead of just "cancel()".
1. Try to write "speakable" sentences and use "for example" instead of "e.g.".

Example:

````typescript
/**
 * Instances of `CancellationToken` can be used to cancel an ongoing request.
 *
 * Example:
 *
 * ```typescript
 * const cancellationToken = new CancellationToken();
 * fetch("http://here.com/", { cancellationToken });
 * // later, if you decide to cancel the request:
 * cancellationToken.cancel();
 * ```
 *
 * **Note:** If you cancel an async function, it does not resolve but throw a
 * [[CancellationException]].
 *
 * **Note:** Cancellation is not guaranteed to work. Some functions do not support cancellation.
 * Others, due to the asynchronous nature, might have already finished by the time the cancellation
 * is received, in which case the result is returned rather than a [[CancellationException]].
 *
 * See also [[fetch]].
 */
...
    /**
     * Constructs a new immutable instance of a `TileKey`.
     *
     * For better readability, [[TileKey.fromRowColumnLevel]] should be preferred.
     *
     * Note - row and column must not be greater than the maximum rows/columns for the given level.
     *
     * @param row Represents the row in the quadtree.
     * @param column Represents the column in the quadtree.
     * @param level Represents the level in the quadtree.
     */
    constructor(public readonly row: number, public readonly column: number, public readonly level: number) {
    }


    /**
     * Equality operator.
     *
     * @param qnr The tile key to compare to.
     * @returns `true` if this tile key has identical row, column, and level, `false` otherwise.
     */
````

## Testing

Every topic/submit should come with tests or a short review in the corresponding ticket of why it cannot be tested and/or what is missing for it to be tested.

Use tests wherever it is possible.

## Code reviews

When reviewing code, please check that the code is in sync with the guidelines. If it would be helpful and/or feasible, you can go over the code together with the owner. When reviewing code, as long as there are comments for changes however trivial, give at least a non-approved state, so the author is aware of the review and the need to address your comments.

## Code formatting

The following tools are used for formating

- [TSLint](https://github.com/Microsoft/vscode-tslint.git)
  We use a `tslint.json` file inside `mapsdk` to keep the formatting rules we apply.

- [Prettier](https://github.com/prettier/prettier-vscode)
  It can be used as an extension for Visual Studio Code to help format the code.

### How should I format my code before submitting for review

Before committing your code, make sure you run `tslint` and `prettier` either via command line or within your IDE (for example, in Visual Studio Code, you could use `Ctrl+Shift+P >Format...`).

In case you need to change styling for the already merged code, make sure to prepare a separate commit with applied formatting and merge it before merging your changes. (Please apply formatting to the whole directory/module).
