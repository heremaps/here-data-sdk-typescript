/**
 * A class that prepare information for calls to getCatalogs from ConfigAPI.
 */
export class CatalogsRequest {
    private schemaHrn: string | undefined;

    public getSchema(): string | undefined {
        return this.schemaHrn;
    }

    /**
     * Set value of layer schema HRN to use in method getCatalogs from ConfigClient.
     * If schema is setted, then getCatalogs will return filtered response by the specified layer schema HRN.
     * If schema is not setted, then filter will return search for all.
     * @param schemaHrn layer schema HRN
     */
    public withSchema(schemaHrn: string): CatalogsRequest {
        this.schemaHrn = schemaHrn;
        return this;
    }
}
