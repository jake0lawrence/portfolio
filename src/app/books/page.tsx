import { Column, Grid, Heading } from '@once-ui-system/core';
import TheLiminalCard from './TheLiminalCard';

export default function Books() {
  return (
    <Column maxWidth="m" gap="l">
      <Heading variant="display-strong-s">Books</Heading>
      <Grid columns="3" mobileColumns="1">
        <TheLiminalCard
          cover="/images/projects/project-01/image-01.jpg"
          synopsis="A speculative fiction novel about crossing realities."
          buyLink="#"
          sampleLink="#"
        />
      </Grid>
    </Column>
  );
}
