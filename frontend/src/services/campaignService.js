import api from './api';

export async function fetchCampaigns({ page = 1, limit = 10, signal } = {}) {
    const res = await api.get('/campaigns', { params: { page, limit }, signal });
    return res.data;
}

export async function fetchCampaignById(id, { signal } = {}) {
    const res = await api.get(`/campaigns/${encodeURIComponent(id)}`, { signal });
    return res.data;
}

export async function createCampaign(payload, { signal } = {}) {
    const res = await api.post('/campaigns', payload, { signal });
    return res.data;
}

export async function updateCampaign(id, payload, { signal } = {}) {
    const res = await api.put(`/campaigns/${encodeURIComponent(id)}`, payload, { signal });
    return res.data;
}

/*
export async function fetchCampaigns({ page = 1, limit = 10 } = {}) {
    // api already returns response.data
    return await api.get('/campaigns', { params: { page, limit } });
}

export async function fetchCampaignById(id) {
    return await api.get(`/campaigns/${encodeURIComponent(id)}`);
}

export async function createCampaign(payload) {
    return await api.post('/campaigns', payload);
}

export async function updateCampaign(id, payload) {
    return await api.put(`/campaigns/${encodeURIComponent(id)}`, payload);
}
*/