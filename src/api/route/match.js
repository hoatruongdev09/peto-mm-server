import { Router } from "express";
import { getMatchInfo } from "../../provider/match.provider.js";

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

export default router