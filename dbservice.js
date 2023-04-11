const uri = "mongodb+srv://ssk:Ajtdmwajt@cluster0.iucpdpe.mongodb.net/?retryWrites=true&w=majority";
const { MongoClient, ServerApiVersion } = require('mongodb')

class ChannelService {
    static instance;
    db = undefined;
    static mongoClinet = undefined;
    isConnected = false;

    constructor() {
    }

    static getInstance() {
        if (!UserDataDtoCrud.instance) {
            UserDataDtoCrud.instance = new UserDataDtoCrud();
        }
        return UserDataDtoCrud.instance;
    }
    static isInstanceExist() {
        return !!UserDataDtoCrud.instance;
    }

    async connect() {
        if (!UserDataDtoCrud.mongoClinet) {
            console.log('trying to connect to DB......')
            try {
                const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
                console.log('Connected to MongoDB');
                this.isConnected = true;
                this.db = client.db("tgclients").collection('channels');
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
            broadcast
        } = channelData
        const cannotSendMsgs = channelData.defaultBannedRights?.sendMessages
        const filter = { channelId: id.toString() };
        const chat = await this.db.findOne(filter);
        if (!chat && !cannotSendMsgs && !broadcast) {
            await this.db.insertOne({ channelId: id.toString(), title, username, megagroup, participantsCount });
        }
    }

    async read(limit) {
        const result = await this.db.findOne({}).limit(limit).sort({ participantsCount: -1, megagroup: -1 })
        if (result) {
            return result;
        } else {
            return undefined;
        }
    }
}

module.exports = ChannelService;
