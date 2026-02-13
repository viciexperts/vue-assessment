import { defineStore } from 'pinia';
import { fetchCampaignById, fetchCampaigns } from '../services/campaignService';

export const useCampaignsStore = defineStore('campaigns', {
    state: () => ({
        list: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 1 },
        listLoading: false,
        listError: null,

        byId: {},
        detailLoading: false,
        detailError: null,

        _lastListRequestId: 0,
        _lastDetailRequestId: 0
    }),

    getters: {
        getById: (state) => (id) => state.byId[String(id)] || null
    },

    actions: {
        async loadList({ page = 1, limit = 10 } = {}) {
            const requestId = ++this._lastListRequestId;
            this.listLoading = true;
            this.listError = null;

            try {
                const result = await fetchCampaigns({ page, limit });

                if (requestId !== this._lastListRequestId) return;

                this.list = result?.data ?? [];
                this.pagination = result?.pagination ?? { page, limit, total: 0, totalPages: 1 };
            } catch (err) {
                if (requestId !== this._lastListRequestId) return;
                this.listError = err;
            } finally {
                if (requestId === this._lastListRequestId) this.listLoading = false;
            }
        },

        async loadById(id) {
            const key = String(id);

            // Cache hit
            if (this.byId[key]) return this.byId[key];

            const requestId = ++this._lastDetailRequestId;
            this.detailLoading = true;
            this.detailError = null;

            try {
                const result = await fetchCampaignById(key);
                if (requestId !== this._lastDetailRequestId) return null;

                const campaign = result?.data ?? null;
                if (campaign) this.byId[key] = campaign;
                return campaign;
            } catch (err) {
                if (requestId !== this._lastDetailRequestId) return null;
                this.detailError = err;
                throw err;
            } finally {
                if (requestId === this._lastDetailRequestId) this.detailLoading = false;
            }
        },

        primeCache(campaign) {
            if (!campaign?.id) return;
            this.byId[String(campaign.id)] = campaign;
        }
    }
});
