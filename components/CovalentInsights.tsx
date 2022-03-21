import { Box, Button, Grid, Paper, Typography } from '@mui/material'
import Link from 'next/link'
import PropTypes from 'prop-types'
import formatAddress from '../utils/formatAddress'
import formatDate from '../utils/formatDate'
import prettyPrintJson from '../utils/prettyPrintJson'
import web3 from 'web3'
import { ArrowForwardIos } from '@mui/icons-material'

const styles = {
	covalentWrap: {
		p: 2,
		mb: 2,
		background: '#fafafa',
		border: '1px solid #ccc',
	},
	cardTitle: {
		mb: 3,
	},
	covalentBtn: {
		mb: 2,
	},
	numMinted: {
		fontWeight: 300,
		fontSize: '2.5rem',
		display: 'inline-block',
		ml: 2,
		verticalAlign: 'sub',
	},
	tokenRow: {
		py: 2,
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderBottom: '1px solid #ccc',
		'&:last-of-type': {
			borderBottom: 0,
		},
	},
	txRow: {
		textAlign: 'left',
		p: 2,
	},
	covalentMeta: {
		display: 'block',
		mb: 5,
		fontSize: '1rem',
		lineHeight: '1.3rem',
	},
}

const propTypes = {
	balData: PropTypes.shape({
		address: PropTypes.string.isRequired,
		updated_at: PropTypes.string.isRequired,
		next_update_at: PropTypes.string.isRequired,
		quote_currency: PropTypes.string.isRequired,
		chain_id: PropTypes.number.isRequired,
		items: PropTypes.array.isRequired,
	}),
	tokensData: PropTypes.shape({
		items: PropTypes.array.isRequired,
		updated_at: PropTypes.string.isRequired,
	}),
	txData: PropTypes.shape({
		items: PropTypes.array.isRequired,
		updated_at: PropTypes.string.isRequired,
	}),
	metaData: PropTypes.shape({
		items: PropTypes.array.isRequired,
		updated_at: PropTypes.string.isRequired,
	}),
}

type CovalentInsightsProps = PropTypes.InferProps<typeof propTypes>

const CovalentInsights = (props: CovalentInsightsProps): JSX.Element => {
	const { balData, tokensData, txData, metaData } = props
	console.log('client props', props)

	return (
		<>
			{balData && (
				<Paper elevation={2} sx={styles.covalentWrap}>
					<Typography variant="h4" sx={styles.cardTitle}>
						NFT Collection Stats
					</Typography>
					<Typography gutterBottom variant="body1">
						<Link href={`https://mumbai.polygonscan.com/address/${balData.address}`} passHref>
							<Button color="secondary" size="small" variant="contained" sx={styles.covalentBtn}>
								View Contract Address
							</Button>
						</Link>
					</Typography>
					<Typography variant="overline" sx={styles.covalentMeta}>
						<strong>Last Updated:</strong> {formatDate(balData.updated_at)}
					</Typography>
					<Typography variant="overline" sx={styles.covalentMeta}>
						<strong>Token Name:</strong> PolyEcho
					</Typography>
					<Typography variant="overline" sx={styles.covalentMeta}>
						<strong>Ticker Symbol:</strong> (ECHO)
					</Typography>
				</Paper>
			)}
			{tokensData && (
				<Paper elevation={2} sx={styles.covalentWrap}>
					<Typography variant="h4" sx={styles.cardTitle}>
						PolyEchoNFT Token Stats
					</Typography>
					<Typography variant="overline" sx={styles.covalentMeta}>
						<strong>Last Updated:</strong> {formatDate(tokensData.updated_at)}
					</Typography>
					<Typography variant="overline" sx={styles.covalentMeta}>
						<strong>Total Tokens Minted:</strong>{' '}
						<Typography component="span" sx={styles.numMinted}>
							{tokensData.items.length}
						</Typography>
					</Typography>
					{tokensData.items.map((token, idx) => (
						<Box sx={styles.tokenRow} key={idx}>
							<Typography variant="h6">Token #{token.token_id}</Typography>
							<Link
								href={`https://mumbai.polygonscan.com/token/0xbd0136694e9382127602abfa5aa0679752ead313?a=${token.token_id}#inventory`}
								passHref
							>
								<Button variant="contained" size="small" color="secondary" endIcon={<ArrowForwardIos />}>
									View NFT
								</Button>
							</Link>
						</Box>
					))}
				</Paper>
			)}
			{metaData && (
				<Paper elevation={2} sx={styles.covalentWrap}>
					<Typography variant="h4" sx={styles.cardTitle}>
						Token Metadata
					</Typography>
					<Typography>Contract Name: {metaData.items[0].contract_name}</Typography>
					<Typography>Ticker Symbol: {metaData.items[0].contract_ticker_symbol}</Typography>
					<pre>
						<code
							className="code-block"
							dangerouslySetInnerHTML={{
								__html: prettyPrintJson(metaData.items[0].nft_data[0]),
							}}
						/>
					</pre>
				</Paper>
			)}
			{txData && (
				<Paper elevation={2} sx={styles.covalentWrap}>
					<Typography variant="h4" sx={styles.cardTitle}>
						Token Transaction Stats
					</Typography>
					<Typography variant="overline" sx={styles.covalentMeta}>
						Last Updated: {formatDate(txData.updated_at)}
					</Typography>
					<Typography variant="overline" sx={styles.covalentMeta}>
						Total Transactions: {txData.items.length}
					</Typography>
					{txData.items.length > 0 && <Typography variant="h5">Transaction History</Typography>}
					{txData.items.map((tx, idx) => {
						const hash = tx.nft_transactions[0].tx_hash
						const to = tx.nft_transactions[0].to_address
						const from = tx.nft_transactions[0].from_address
						const value = tx.nft_transactions[0].value
						const amount = web3.utils.fromWei(value, 'ether')
						return (
							<Box sx={styles.txRow} key={idx}>
								<Typography variant="h6">Transaction {idx + 1}</Typography>
								<Grid container spacing={1}>
									<Grid item xs={12} sm={6}>
										<Typography>Price: {amount} MATIC</Typography>
										<Typography>Hash: {formatAddress(hash)}</Typography>
									</Grid>
									<Grid item xs={12} sm={6}>
										<Typography>From: {formatAddress(from)}</Typography>
										<Typography>To: {formatAddress(to)}</Typography>
									</Grid>
								</Grid>
							</Box>
						)
					})}
				</Paper>
			)}
			<Typography variant="overline" sx={{ ...styles.covalentMeta, textAlign: 'center' }}>
				Powered by <Link href="https://www.covalenthq.com/">Covalent</Link>
			</Typography>
		</>
	)
}

CovalentInsights.propTypes = propTypes

export default CovalentInsights
