Generates code from OpenAPI descriptions

Use the official swagger-codegen, (https://github.com/swagger-api/swagger-codegen)

Here's an example invocation to generate our output:

```bash
java \
    -jar modules/swagger-codegen-cli/target/swagger-codegen-cli.jar \
    generate \
    -i swagger-specification.json
    -t templates/TypeScript-Fetch \
    -l typescript-fetch \
    -o out
```
