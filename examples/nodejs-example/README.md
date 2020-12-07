# Download data with HERE Data SDK for Typescript

You can use this example app to fetch data from versioned layers and save it to files.

## Build and install

To build the app, run `npm run build`.

If you want to use the app in any folder, install it globally by running `npm install -g .`.

## Use the app

If you installed the app globally, to see the list of available parameters, run `download-partitions --help`.
Otherwise, in the app folder, run `node . --help`.

You can use the app to do the following:

- Download and save partitions to the current directory.

    ```bash
    download-partitions -c <your catalog HRN> \
        -l <your layer ID> \
        -p partitionId1,partitionId2,partitionId3
    ```

- Download partitions from a catalog version and save them to the current directory.

    ```bash
    download-partitions -c <your catalog HRN> \
        -l <your layer ID> \
        -p partitionId1,partitionId2,partitionId3 \
        -v <catalog version>
    ```

- Download and save partitions to a specific directory.

    ```bash
    download-partitions -c <your catalog HRN> \
        -l <your layer ID> \
        -p partitionId1,partitionId2,partitionId3 \
        -o <path to the output folder>
    ```

- Download partitions defined in a file and save them to a specific directory.

    ```bash
    download-partitions -c <your catalog HRN> \
        -l <your layer ID> \
        --pf <path to your file with list of partition IDs> \
        -o <path to the output folder>
    ```

- Download a partition from a versioned layer with the HERE tile partitioning schema using the `row,column,level` string (a tile key) and save the partition to a specific directory.

    ```bash
    download-partitions -c <your catalog HRN> \
    -l <your layer ID> \
    -q 1580,2069,12 \
    -o <path to the output folder>
    ```
