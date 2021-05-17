Generates code from OpenAPI descriptions

Use the official swagger-codegen, (https://github.com/swagger-api/swagger-codegen)

Here's an example invocation to generate our output:

```bash
swagger-codegen generate -i spec.json -t templates/TypeScript-Fetch -l typescript-fetch -o out --template-engine mustache
```
