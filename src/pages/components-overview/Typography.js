// material-ui
import { Grid, Stack } from '@mui/material';

// project import
import ComponentSkeleton from './ComponentSkeleton';
import StyledTableCell from './Table2'
import MainCard from 'components/MainCard';

// ==============================|| COMPONENTS - TYPOGRAPHY ||============================== //

const ComponentTypography = () => (
  <ComponentSkeleton>
    <Grid container spacing={3}>
      <Grid item xs={12} lg={6}>
        <Stack spacing={3}>
          <MainCard bgColor="#f5f5f5">
            <StyledTableCell/>
          </MainCard>
        </Stack>
      </Grid>
    </Grid>
  </ComponentSkeleton>
);

export default ComponentTypography;
