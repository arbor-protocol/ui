import { Box, Container, Grid, Typography } from '@mui/material'

import ProjectCard from './ProjectCard'
import styles from './RecentProjectActivity.styles'

type RecentProjectActivityProps = {
	projects: any[]
}

const RecentProjectActivity = ({ projects }: RecentProjectActivityProps): JSX.Element => {
	return (
		<Box sx={styles.recentActivity} component="section">
			<Container maxWidth="xl">
				<Typography variant="h2" sx={styles.header}>
					Recent Activity
				</Typography>
				<Typography sx={styles.subheader}>Check out a few of the most recently updated projects on Arbor.</Typography>
				<Grid container spacing={3}>
					{projects.map(project => (
						<Grid item xs={12} sm={4} key={project._id}>
							<ProjectCard details={project} />
						</Grid>
					))}
				</Grid>
			</Container>
		</Box>
	)
}

export default RecentProjectActivity
