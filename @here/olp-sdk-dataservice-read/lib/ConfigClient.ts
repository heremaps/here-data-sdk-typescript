import { ConfigApi } from "@here/olp-sdk-dataservice-api";
import { CatalogsRequest } from "./CatalogsRequest";
import { DataStoreContext } from "./DataStoreContext";
import { DataStoreRequestBuilder } from "./DataStoreRequestBuilder";

export class ConfigClient {
    /**
     * Constructs a new client to the data store to work with data
     * about catalogs configurations in the store.
     *
     * @param context The context of the data store with shared and cached data (base urls, for example)
     */
    constructor(private readonly context: DataStoreContext) {}

    /**
     * Asynchronously retrieves a list of catalogs that your account has access to.
     * If set the schema, then will return filtered only catalogs (layers) by the specified layer schema HRN.
     * If schema is not setted, then filter will return search for all.
     */
    public async getCatalogs(
        catalogsRequest: CatalogsRequest
    ): Promise<ConfigApi.CatalogsListResult> {
        const configBaseUrl = await this.context.getBaseUrl("config");

        return ConfigApi.getCatalogs(
            new DataStoreRequestBuilder(
                this.context.dm,
                configBaseUrl,
                this.context.getToken
            ),
            catalogsRequest.getSchema()
                ? { verbose: "true", schemaHrn: catalogsRequest.getSchema() }
                : {}
        );
    }
}
