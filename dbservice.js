const uri = "mongodb+srv://ssk:Ajtdmwajt@cluster0.iucpdpe.mongodb.net/?retryWrites=true&w=majority";
const { MongoClient, ServerApiVersion } = require('mongodb')

class ChannelService {
    static instance;
    db = undefined;
    users = undefined;
    static mongoClinet = undefined;
    isConnected = false;

    constructor() {
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
        if (!ChannelService.mongoClinet) {
            console.log('trying to connect to DB......')
            try {
                const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
                console.log('Connected to MongoDB');
                this.isConnected = true;
                this.db = client.db("tgclients").collection('channels');
                this.users = client.db("tgclients").collection('users');
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
        const chat = await this.db?.findOne(filter);
        if (!chat && !cannotSendMsgs && !broadcast) {
            await this.db.insertOne({ channelId: id.toString(), username: `@${username}`, title, megagroup, participantsCount });
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
            console.log(error)
        }

    }

    async read(limit) {
        const result = await this.db?.findOne({}).limit(limit).sort({ participantsCount: -1, megagroup: -1 })
        if (result) {
            return result;
        } else {
            return undefined;
        }
    }
}

module.exports = ChannelService;
