// material-ui
import { Grid, Stack } from '@mui/material';

// project import
import ComponentSkeleton from './ComponentSkeleton';
import Income from './Income';
import MainCard from 'components/MainCard';
import StyledTableCell from './Incometable'

// ==============================|| COMPONENTS - TYPOGRAPHY ||============================== //

const ComponentIncome = () => (
  <ComponentSkeleton>
    <Grid container spacing={3}>
      <Grid item xs={12} lg={6}>
        <Stack spacing={3}>
          <MainCard bgColor="#f5f5f5">
            <Income/>
            <StyledTableCell/>
          </MainCard>
        </Stack>
      </Grid>
    </Grid>
  </ComponentSkeleton>
);

export default ComponentIncome;
