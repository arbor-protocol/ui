import type { NextApiRequest, NextApiResponse } from 'next'
import { INftDoc, Nft } from '../../../models/nft.model'
import dbConnect from '../../../utils/db'
import { update } from '../../../utils/http'

async function handler(req: NextApiRequest, res: NextApiResponse) {
	const {
		query: { id },
		method,
		body,
	} = req

	await dbConnect()

	switch (method) {
		/* Get a model by its ID */
		case 'GET':
			try {
				const nft: INftDoc | null = await Nft.findById(id)
				if (!nft) return res.status(404).json({ success: false })
				res.status(200).json({ success: true, data: nft })
			} catch (error) {
				res.status(400).json({ success: false, error: 'Failed to get the NFT' })
			}
			break

		/* Update a model by its ID */
		case 'PUT':
			try {
				console.log({ body })
				const nft: INftDoc | null = await Nft.findByIdAndUpdate(
					id,
					{
						$set: {
							isListed: body.isListed,
							listPrice: body.listPrice,
							owner: body.owner,
						},
					},
					{
						new: true,
						runValidators: true,
					},
				)

				// Catch error
				if (!nft) {
					return res.status(400).json({ success: false, error: 'failed to update the NFT' })
				}

				// If changing ownership...
				if (body.buyer && body.seller) {
					// Add the new NFT reference to list of User NFTs field
					let userUpdated = await update(`/users/${body.buyer}`, { addNFT: id })
					if (!userUpdated) return res.status(400).json({ success: false, error: "Failed to add to user's NFTs" })

					// TODO: remove NFT ID from seller's list of nfts
					userUpdated = await update(`/users/${body.seller}`, { removeNFT: id })
					if (!userUpdated) return res.status(400).json({ success: false, error: "Failed to remove from user's NFTs" })
				}

				res.status(200).json({ success: true, data: nft })
			} catch (error) {
				res.status(400).json({ success: false, error: '' })
			}
			break

		default:
			res.status(400).json({ success: false, error: `HTTP method '${method}' is not supported` })
			break
	}
}

export default handler
