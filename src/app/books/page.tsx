import { Column, Grid, Heading } from '@once-ui-system/core';
import TheLiminalCard from './TheLiminalCard';

export default function Books() {
  return (
    <Column maxWidth="m" gap="l">
      <Heading variant="display-strong-s">Books</Heading>
      <Grid columns="3" mobileColumns="1">
        <TheLiminalCard
          cover="https://i.imgur.com/ixuC2W8h.jpg"
          synopsis="In the darkness between dimensions, something ancient is waking. The Liminal is a sci-fi horror descent into fractured time, shifting realities, and a voice that isn’t yours."
          readLink="https://books.jakelawrence.io/2/the-liminal"
        />
      </Grid>
    </Column>
  );
}
