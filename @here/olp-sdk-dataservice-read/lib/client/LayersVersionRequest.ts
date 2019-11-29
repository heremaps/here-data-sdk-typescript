import { validateBillingTag } from "..";

export class LayersVersionRequest {
    private version: number | undefined;
    private billingTag?: string;

    /**
     * Catalog version.
     */
    public getVersion(): number | undefined {
        return this.version;
    }

    /**
     * Set version value to use in methods getVersion from [[CatalogClient]].
     *
     * @param version Specify the catalog version.
     * @returns The updated [[LayersVersionRequest]] instance
     */
    public withVersion(version: number): LayersVersionRequest {
        this.version = version;
        return this;
    }
    /**
     * Billing Tag for grouping billing records together.
     */
    public getBillingTag(): string | undefined {
        return this.billingTag;
    }

    /**
     * Billing Tag is an optional free-form tag which is used for grouping billing records together.
     * If supplied, it must be between 4 - 16 characters, contain only alpha/numeric ASCII characters [A-Za-z0-9].
     */
    public withBillingTag(tag: string): LayersVersionRequest {
        this.billingTag = validateBillingTag(tag);
        return this;
    }
}
