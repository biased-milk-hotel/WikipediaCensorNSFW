/*
===============================================================
 

  [NSFW WARNING!]
  Obviously NSFW warning for this entire file


===============================================================
*/

// the array below contains regex patterns to consider X as NSFW
export const NSFW_PATTERNS = [
  /(private.{0,3}part|breasted)/i,
  /\b(having|have|perform|depict|oral)(ing|).{0,14}sex/i,
  /\b(sex|69|t-square).{0,3}position/i,

  /\bpenetration\b/i,

  /\b(mating|coitus|intercourse|rape|copulate|copulating)\b/,
  /(\bsexual|erotic|erotism)/i,
  /\b(clitoris|rectum)\b/i,
  /\bfingering\b/,
  /\b(cunnilingus|anilingus|whipping|facesitting|flagellation|fellatio|fellation|bdsm|dominatrix|bondage|anal|anally|pegging|ejaculation|sperm)(s|es|)\b/i,
  /\bdeep\W{0,4}throat(ing|)\b/i,
  /\btea\W{0,4}bag(ging|)\b/i,
  /\b(testicle|testicular|nipple|breast|testes|testis|scrotum|genitalia|genital|anus|penis|vagina|vaginal|vaginally|vulva|vulvae|labia|ovary|ovaries)(s|es|)\b/i,
  /\b(reproduction|reproductive)/i,
  /\W*bath(er|ers|)\b/i,
  /\b(kamasutra|kama sutra|pubic)\b/i,

  /(naked|nude|nudist|naturist|nudity)(s|es|)\b/i,
  /(showering|skinny dipping|skinny dip|swim|swimming|sauna)/i,
  /(urine|urinating|urination|urinate|urinary)/i,
];
