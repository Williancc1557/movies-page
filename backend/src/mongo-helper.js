import { MongoClient } from "mongodb";

export const mongoHelper = {
  client: null,
  async connect(url) {
    this.client = await new MongoClient(url || process.env.MONGO_URL).connect();
  },

  async disconnect() {
    await this.client.close();
    this.client = null;
  },

  dbCollection() {
    return;
  },

  async getCollection(name) {
    try {
      return this.client.db().collection(name);
    } catch {
      await this.connect();
      return this.client.db().collection(name);
    }
  },

  // eslint-disable-next-line
  map(account) {
    try {
      const { _id, ...accountWithoudId } = account;

      return {
        ...accountWithoudId,
        id: _id.toString(),
      };
    } catch {
      return null;
    }
  },

  mapArray(datas) {
	try {
		return datas.map((data) => {
			const { _doc } = data;
			const { _id, ...dataWithoudId } = _doc;

			return {
				id: _id.toString(),
				...dataWithoudId,
			};
		});
	} catch {
		return null;
	}
},
};