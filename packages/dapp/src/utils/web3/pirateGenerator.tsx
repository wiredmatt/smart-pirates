const hashAddress = (address: string) => {
  let hash = 0,
    len = address.length;
  for (let i = 0; i < len; i++) {
    hash = (hash << 5) - hash + address.charCodeAt(i);
    hash |= 0; // to 32bit integer
  }

  let pirateId = hash.toString()[0];

  return pirateId;
};

export const getRandomPirateAvatar = (address: string) => {
  let pirateIcon = "/assets/pirates/" + hashAddress(address) + ".png";
  return pirateIcon;
};

const pirates = [
  {
    name: "Edward Newgate",
    bio: 'Edward Newgate, more commonly known as "Whitebeard", was the captain of the Whitebeard Pirates and was widely known as the "Strongest Man in the World" and, after Gol D. Roger\'s death, the "Man Closest to One Piece"',
    location: "Grand Line",
  },
  {
    name: "Donquixote Doflamingo",
    bio: 'Donquixote Doflamingo, nicknamed "Heavenly Yaksha", is the captain of the Donquixote Pirates. Prior to his imprisonment, he was a member of the Seven Warlords of the Sea with a frozen bounty of ฿340,000,000, as well as the most influential underworld broker under the codename "Joker". He is also a former World Noble, descended from the Donquixote Family.',
    location: "Red Line, Mary Geoise",
  },
  {
    name: "Trafalgar D. Water Law",
    bio: 'Trafalgar D. Water Law, more commonly known as just Trafalgar Law (トラファルガー・ロー Torafarugā Rō) and by his epithet as the "Surgeon of Death", is a pirate from North Blue and the captain and doctor of the Heart Pirates. He is one of twelve pirates who are referred to as the "Worst Generation". He became one of the Seven Warlords of the Sea during the timeskip, but his position was revoked for allying with the Straw Hat Pirates. Law, like many other pirates, dreams of finding the One Piece, while also desiring to know the purpose of the Will of D.',
    location: "North Blue",
  },
  {
    name: "Kaidou",
    bio: 'Kaidou of the Beasts, renowned as the world\'s "Strongest Creature", is the Governor-General of the Beasts Pirates and one of the Four Emperors ruling over the New World. He is also the father of Yamato.',
    location: "Grand Line",
  },
  {
    name: "Marshall D. Teach",
    bio: "Marshall D. Teach, most commonly referred to by his epithet Blackbeard, is the captain-turned-admiral of the Blackbeard Pirates, currently one of the Four Emperors. He is also the only known person in history to wield the powers of two Devil Fruits.",
    location: "Grand Line",
  },
  {
    name: "Monkey D. Dragon",
    bio: "Monkey D. Dragon, commonly known as the \"World's Worst Criminal\", is the infamous Supreme Commander (総司令官 Sōshireikan) of the Revolutionary Army, who has been attempting to overthrow the World Government. He is the father of Monkey D. Luffy and the son of Monkey D. Garp, having been born in the Goa Kingdom just like them. He was also responsible for saving Sabo's life after the latter almost drowned from a World Noble attack, eventually turning the boy into his second-in-command.",
    location: "East Blue, Goa Kingdom",
  },
  {
    name: "Shanks Le Roux",
    bio: '"Red-Haired" Shanks, commonly known as just "Red Hair", is the chief of the Red Hair Pirates and one of the Four Emperors that rule over the New World.',
    location: "West Blue",
  },
  {
    name: "Crocodile",
    bio: '"Desert King" Sir Crocodile is the former president of the mysterious crime syndicate Baroque Works, formerly operating under the codename "Mr. 0", with Nico Robin, formerly known as "Miss All Sunday", operating as his Vice-President and partner. He was the primary antagonist of the Arabasta Arc, and the central antagonist of the Arabasta Saga.',
    location: "Grand Line",
  },
  {
    name: "Gol D. Roger",
    bio: "Gol D. Roger, more commonly known as Gold Roger, was a legendary pirate who, as captain of the Roger Pirates, held the title of Pirate King and owned the legendary treasure known as One Piece. He was also the lover of Portgas D. Rouge and the biological father of Portgas D. Ace.",
    location: "East Blue, Loguetown",
  },
];

export const getRandomPirateProfile = (address: string) => {
  const id = hashAddress(address);
  const key = parseInt(id) - 1;
  return pirates[key];
};
