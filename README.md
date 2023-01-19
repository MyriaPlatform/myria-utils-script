# Myria Utils Script

Script Utils for Myria

## Installation

```bash
git clone <repository-url>
cd <repository-url>
npm install
```

### Setup scripts.
Setup the the configuration based 
There are multiple config environment json file that we can use based on the desire env.

`DEV` and `STAGING` are all internal Myria environments.
`PRODUCTION` are using for both of Internal and External (Partner)

#### Distribute ERC-721 tokens

#### Step 1:

```
  "tokenAddressERC721": "Contract address of your collections",
  "senderStarkPrivateKey": "Private stark key for your L2 account",
  "senderStarkPublicKey": "Normal public stark key for your L2 wallet address"
```
+ Token address : Smart contract address for your deployed collection in the Myria system
+ To get the stark public key, you can refer on the documentation[https://docs.myria.com/]
+ To get the senderStarkPrivateKey, just simply make one random transaction (listing/purchase) for whatever NFTs, and we can inspect the browser to get the value on the console 
`[generateStarkSignature] privateStarkKeyInternal -> abcdef......

#### Step 2:
Fulfilled the csv files which are placed on `public/storages/production/transfer_erc721_example.csv`
The CSV format file includes two column: `tokenId,receiverWalletAddress`
+ TokenID: identifier of the token NFT which have been minted
+ receiverWalletAddress: The user's wallet address to receive the NFTs

Due to the limitation for batch in Myria system, it's highly recommend that we have maximum 20 rows per csv file to make the transfer process better and avoid unexpected failing.

You can also have multiple CSV files with different name to manage the list of users received token.
And simply look up into the path `src/scripts/transfer_erc721_example.script.ts`
And adjust the name on the `line 39`:
+ From `${this.filePath}/${configService.env}/transfer-erc721.csv`
+ To `${this.filePath}/${configService.env}/transfer-erc721_example_whatever_name.csv`

#### Step 3:

Trigger the scripts by command to transfer NFTs token.
It is highly recommend that we should test on the staging environment and operate the same steps to avoid any mismatch or error prone. As long as the configuration setup fine on the staging, we can go ahead with the production.

Run command:
+ Distribute tokens on the staging env:

```
     yarn transfer:erc721:stg
```

+ Distribute tokens on the production env:

```
     yarn transfer:erc721:prod
```

### Supported environments

- Local
- Dev
- Staging
- Production



### Update values inside the `configs/.config.$ENVIRONMENT.json`

`Noted`: new variables must be added to all file to synchronize with other environments

```bash
.
├── configs
│   ├── config.local.json
│   ├── config.dev.json
│   ├── config.staging.json
|   └── config.prod.json
```

### Update your environment with .env

```bash
cp .example.env .env
# Then update the value for variable in the .env if needed
```


## Source Structure

```bash
.
src
├── app.controller.spec.ts
├── app.controller.ts
├── app.module.ts
├── app.service.ts
├── main.ts # start app server
├── modules # contain main modules inside the service
├── shared
└── utils # contain common providers, services, functions
...
```

Each module structure

```bash
.
├── types # contain Data Transfer Object for ex: *.input.ts, *.payload.ts, *.enum.ts
│   └── user-register.payload.ts
│   └── register-user.interface.ts
├── mocks # contain mock for ex: *.mock.ts
│   └── get-user.mock.ts
├── services # interact with database directly for ex: *.handler.ts
│   └── user.handler.ts
├── handlers # main logic of each single feature with repositories and controller
│   ├── user-get-action.handler.ts
│   └── user-register-action.handler.ts
├── tests
│   ├── user-get-action.test.ts
│   └── user-register-action.test.ts
├── user.controller.spec.ts # contain test code(unit test, integration test)
├── user.controller.ts # controller interacts service with the current request
└── user.module.ts # mapping controller, services, repositories ...etc
```
