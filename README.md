<br/>
<p align='center'>
    <img src="./src/assets/logo_trans.png" width=350/>
</p>

<br/>

# Tantrika
## An Open-Source Distributed AI Infrastructure on FEVM

### [https://tantrika-653f4f.spheron.app/](https://tantrika-653f4f.spheron.app/)

## Problem Statement
In the web2 era, there were dataset providers. However, they either required lengthy contracts or required that transactions be handled by a third party at a cost of hefty fees and human overhead.

## Solution
FEVM has the capacity to allow such native exchanges without establishing additional networks or external bridges to facilitate storage thanks to its close relationship with Filecoin and support for deal-making.

- Users can upload their dataset and create a purchase catalogue containing secured datasets on IPFS
- The data integrity can be governed by the users. If there is a dataset containing wrong or bad data, users can flag the dataset as deceptive.
- To keep scammers out of the platform, the dataset owner will only be paid after three consecutive non-flagged purchases
- The owner can update the pricing or de-list the catalogue

## Tech Stack
**FEVM:** serves as the platform's main network. With the help of FEVM, smart contracts may be deployed and interacted with in the field without incurring significant additional expenses or delays.

**IPFS:** preserving and storing records. All uploaded datasets use IPFS as the primary backend. Following purchase, the user is given access to the dataset.

**Web3.storage:** used as the decentralized data storage layer by integrating IPFS

## Demo Video

https://github.com/shivanshxyz/tantrika/assets/24312840/21872815-9c1d-407e-a4de-66f4cc23c93c

