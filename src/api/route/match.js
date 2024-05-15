import { Router } from "express";
import { getMatchInfo, findPlayerInMatch, getMatchMakingInfo, closeMatch } from "../../provider/match.provider.js";
import { jwtDecode } from "jwt-decode";

const router = Router()

router.get('/:id', async (req, res) => {
    const { id } = req.params
    console.log("find match by id: ", id)
    try {
        res.status(200).json({
            status: true,
            data: await getMatchInfo(id)
        })
    } catch (err) {
        res.status(500).json({
            status: false,
            error: err.message
        })
    }
})

router.post('/validate-token', async (req, res) => {
    const { token, match_id } = req.body
    const { user_id } = jwtDecode(token)
    try {
        res.status(200).json({
            status: true,
            data: await findPlayerInMatch(user_id, match_id)
        })
    } catch (err) {
        res.status(500).json({
            status: false,
            error: err.message
        })
    }
})

router.get('/matchmaking-info/:matchId', async (req, res) => {
    const { matchId } = req.params
    try {
        res.status(200).json({
            status: true,
            data: await getMatchMakingInfo(matchId)
        })
    } catch (err) {
        res.status(500).json({
            status: false,
            error: err.message
        })
    }
})

router.post('/close-match/:matchId', async (req, res) => {
    const { matchId } = req.params
    try {
        res.status(200).json({
            status: true,
            data: await closeMatch(matchId)
        })
    } catch (err) {
        res.status(500).json({
            status: false,
            error: err.message
        })
    }
})

export default router