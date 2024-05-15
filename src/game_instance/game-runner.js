import axios from "axios"

export const getInstanceInfo = async (request_id) => {
    try {
        const { data } = await axios.get(`https://api.edgegap.com/v1/status/${request_id}`, {
            headers: {
                'Authorization': 'token a9cc2159-e1f8-446f-80ff-27cb226fc79e',
            }
        })
        return data
    } catch (error) {
        throw error
    }
}

export const deleteInstance = async (request_id) => {
    try {
        const { data } = await axios.delete(`https://api.edgegap.com/v1/stop/${request_id}`, {
            headers: {
                'Authorization': 'token a9cc2159-e1f8-446f-80ff-27cb226fc79e',
            }
        })
        return data
    } catch (error) {
        throw error
    }
}
export const createInstance = async (gameId, listIP, version = 'dev_1.0.1') => {
    try {
        const data = await axios.post('https://api.edgegap.com/v1/deploy', {

            app_name: 'petopia',
            version_name: 'dev_1.0.1',
            ip_list: listIP,
            env_vars: [
                {
                    "key": "GAME_ID",
                    "value": `${gameId}`,
                    "is_hidden": false
                }
            ]

        }, {
            headers: {
                'Authorization': 'token a9cc2159-e1f8-446f-80ff-27cb226fc79e',
            }
        })
        return data
    } catch (err) {
        throw err
    }
}
