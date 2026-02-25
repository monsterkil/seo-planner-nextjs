export interface AnchorItem {
  a: string;
  t: 'e' | 'p' | 'b' | 'g';
  ctx?: string;
}

export const BL = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

export const BN = [
  'Atrakcje na wesele — 15 pomysłów, które zachwycą gości',
  'Jak zrobić ściankę do zdjęć na 18? Poradnik DIY',
  'Atrakcje na 18 urodziny na sali — czym zaskoczyć gości?',
  'Dekoracja stołu komunijnego — pomysły, które zrobisz sam',
  'Jak zrobić ściankę z balonów? Stelaż, materiały i montaż',
  'Baby shower — pomysły na dekoracje, zabawy i prezenty',
  'Gender reveal party — pomysły na ujawnienie płci',
];

export const blogLinks = [7, 7, 6, 5, 5, 4, 3];

export const strongMoney: AnchorItem[] = [
  { a: 'litery ze styroduru', t: 'e' }, { a: 'litery przestrzenne ze styroduru', t: 'p' },
  { a: 'litery ze styroduru', t: 'e' }, { a: 'producent liter ze styroduru', t: 'p' },
  { a: 'litery ze styroduru', t: 'e' }, { a: 'litery 3d ze styroduru', t: 'p' },
  { a: 'litery ze styroduru', t: 'e' }, { a: 'litery styrodurowe na zamówienie', t: 'p' },
  { a: 'litery ze styroduru', t: 'e' }, { a: 'litery ze styroduru na zamówienie', t: 'p' },
  { a: 'litery ze styroduru', t: 'e' }, { a: 'litery reklamowe ze styroduru', t: 'p' },
  { a: 'litery ze styroduru', t: 'e' },
];

export const strongBlogs: AnchorItem[][] = [
  [
    { a: 'atrakcje na wesele', t: 'e' }, { a: 'atrakcje weselne pomysły', t: 'p' },
    { a: 'atrakcje na wesele', t: 'e' }, { a: 'pomysły na atrakcje na wesele', t: 'p' },
    { a: 'atrakcje na wesele', t: 'e' }, { a: 'atrakcje weselne 2026', t: 'p' },
    { a: 'atrakcje na wesele', t: 'e' },
  ],
  [
    { a: 'ścianka do zdjęć na 18', t: 'e' }, { a: 'jak zrobić ściankę na osiemnastkę', t: 'p' },
    { a: 'ścianka do zdjęć na 18', t: 'e' }, { a: 'ścianka fotograficzna na 18 DIY', t: 'p' },
    { a: 'ścianka do zdjęć na 18', t: 'e' }, { a: 'ścianka na osiemnastkę krok po kroku', t: 'p' },
    { a: 'ścianka do zdjęć na 18', t: 'e' },
  ],
  [
    { a: 'atrakcje na 18 urodziny', t: 'e' }, { a: 'atrakcje na osiemnastkę na sali', t: 'p' },
    { a: 'atrakcje na 18 urodziny', t: 'e' }, { a: 'pomysły na atrakcje na 18', t: 'p' },
    { a: 'atrakcje na 18 urodziny', t: 'e' }, { a: 'czym zaskoczyć gości na 18', t: 'p' },
  ],
  [
    { a: 'dekoracja stołu komunijnego', t: 'e' }, { a: 'pomysły na stół komunijny', t: 'p' },
    { a: 'dekoracja stołu komunijnego', t: 'e' }, { a: 'jak udekorować stół na komunię', t: 'p' },
    { a: 'dekoracja stołu komunijnego', t: 'e' },
  ],
  [
    { a: 'ścianka z balonów', t: 'e' }, { a: 'jak zrobić ściankę balonową', t: 'p' },
    { a: 'ścianka z balonów', t: 'e' }, { a: 'ścianka balonowa DIY krok po kroku', t: 'p' },
    { a: 'ścianka z balonów', t: 'e' },
  ],
  [
    { a: 'baby shower pomysły', t: 'e' }, { a: 'pomysły na baby shower dekoracje', t: 'p' },
    { a: 'baby shower pomysły', t: 'e' }, { a: 'jak udekorować baby shower', t: 'p' },
  ],
  [
    { a: 'gender reveal pomysły', t: 'e' }, { a: 'pomysły na gender reveal party', t: 'p' },
    { a: 'gender reveal pomysły', t: 'e' },
  ],
];

export const weakMoney: AnchorItem[] = [
  { a: 'Folplex', t: 'b' }, { a: 'tutaj', t: 'g' }, { a: 'folplex.pl', t: 'b' }, { a: 'sprawdź ofertę', t: 'g' },
  { a: 'https://folplex.pl', t: 'b' }, { a: 'na tej stronie', t: 'g' }, { a: 'oferta Folplex', t: 'b' }, { a: 'więcej informacji', t: 'g' },
  { a: 'na stronie folplex.pl', t: 'b' }, { a: 'kliknij tutaj', t: 'g' }, { a: 'Folplex litery', t: 'b' }, { a: 'zobacz ofertę', t: 'g' },
  { a: 'folplex.pl/oferta', t: 'b' }, { a: 'polecam', t: 'g' }, { a: 'firma Folplex', t: 'b' }, { a: 'link', t: 'g' },
  { a: 'Folplex Warszawa', t: 'b' }, { a: 'szczegóły oferty', t: 'g' }, { a: 'strona Folplex', t: 'b' }, { a: 'tutaj znajdziesz', t: 'g' },
  { a: 'folplex.pl', t: 'b' }, { a: 'sprawdź', t: 'g' }, { a: 'Folplex', t: 'b' }, { a: 'na tej stronie', t: 'g' },
  { a: 'oferta', t: 'g' }, { a: 'folplex.pl', t: 'b' }, { a: 'więcej', t: 'g' }, { a: 'Folplex', t: 'b' },
  { a: 'tutaj', t: 'g' }, { a: 'folplex.pl', t: 'b' },
];

export const weakBlogs: AnchorItem[][] = [
  [{ a: 'na blogu Folplex', t: 'b' }, { a: 'w tym artykule', t: 'g' }, { a: 'artykuł na folplex.pl', t: 'b' }, { a: 'tutaj', t: 'g' }, { a: 'Folplex blog', t: 'b' }, { a: 'czytaj więcej', t: 'g' }],
  [{ a: 'artykuł na folplex.pl', t: 'b' }, { a: 'więcej informacji', t: 'g' }, { a: 'na blogu Folplex', t: 'b' }, { a: 'w tym artykule', t: 'g' }, { a: 'Folplex', t: 'b' }, { a: 'czytaj dalej', t: 'g' }],
  [{ a: 'Folplex blog', t: 'b' }, { a: 'w tym artykule', t: 'g' }, { a: 'na blogu folplex.pl', t: 'b' }, { a: 'czytaj więcej', t: 'g' }, { a: 'Folplex', t: 'b' }],
  [{ a: 'na blogu folplex.pl', t: 'b' }, { a: 'w tym poradniku', t: 'g' }, { a: 'Folplex', t: 'b' }, { a: 'w tym artykule', t: 'g' }],
  [{ a: 'poradnik na folplex.pl', t: 'b' }, { a: 'czytaj więcej', t: 'g' }, { a: 'Folplex blog', t: 'b' }, { a: 'tutaj', t: 'g' }],
  [{ a: 'Folplex', t: 'b' }, { a: 'w tym przewodniku', t: 'g' }, { a: 'na blogu folplex.pl', t: 'b' }],
  [{ a: 'blog folplex.pl', t: 'b' }, { a: 'ten poradnik', t: 'g' }],
];

export const internalLinks: AnchorItem[][] = [
  [{ a: 'litery ze styroduru na wesele', t: 'p', ctx: '„Wśród modnych dekoracji rośnie popularność liter ze styroduru na wesele – np. podświetlany napis LOVE."' }, { a: 'zamów litery ze styroduru', t: 'g', ctx: 'CTA w ramce na końcu akapitu o dekoracjach.' }],
  [{ a: 'duże cyfry ze styroduru', t: 'p', ctx: '„Na ściance świetnie prezentują się duże cyfry ze styroduru z imieniem jubilata."' }, { a: 'zamów napis ze styroduru', t: 'g', ctx: 'CTA pod sekcją o materiałach na ściankę.' }],
  [{ a: 'personalizowane litery ze styroduru', t: 'p', ctx: '„Coraz częściej gospodarze zamawiają personalizowane litery ze styroduru – imię + cyfra 18."' }, { a: 'sprawdź ofertę', t: 'g', ctx: 'Naturalny CTA w akapicie o dekoracjach sali.' }],
  [{ a: 'imię dziecka ze styroduru', t: 'p', ctx: '„Na środku stołu komunijnego pięknie wygląda imię dziecka wycięte ze styroduru."' }, { a: 'zamów litery ze styroduru', t: 'g', ctx: 'Link w ramce pod inspiracjami.' }],
  [{ a: 'napis ze styroduru do ścianki', t: 'p', ctx: '„Między balonami wkomponuj napis ze styroduru – np. imię lub cyfrę."' }, { a: 'zamów napis ze styroduru', t: 'g', ctx: 'CTA na końcu sekcji o materiałach.' }],
  [{ a: 'imię dziecka ze styroduru', t: 'p', ctx: '„Popularna dekoracja baby shower to imię dziecka ze styroduru w pastelowym kolorze."' }, { a: 'sprawdź ofertę', t: 'g', ctx: 'Link przy akapicie o dekoracjach.' }],
  [{ a: 'litery BOY GIRL ze styroduru', t: 'p', ctx: '„Duże litery BOY lub GIRL ze styroduru to efektowny element ujawnienia płci."' }, { a: 'zamów litery ze styroduru', t: 'g', ctx: 'CTA pod sekcją o pomysłach.' }],
];

export interface KeywordIdea {
  num: string;
  keyword: string;
  vol: string;
  serp: string;
  linkStrength: 'silny' | 'średni' | 'słaby';
  title: string;
}

export const keywordIdeas: KeywordIdea[] = [
  { num: '1 ✅', keyword: 'atrakcje na wesele', vol: '1 000', serp: 'blogi', linkStrength: 'silny', title: 'Atrakcje na wesele — 15 pomysłów, które zachwycą gości' },
  { num: '2 ✅', keyword: 'ścianka do zdjęć na 18 jak zrobić', vol: '700', serp: 'blogi/YT', linkStrength: 'silny', title: 'Jak zrobić ściankę do zdjęć na 18? Poradnik DIY krok po kroku' },
  { num: '3', keyword: 'jak zrobić girlandę z balonów', vol: '700', serp: 'blogi/YT', linkStrength: 'średni', title: 'Jak zrobić girlandę z balonów? Prosty poradnik + lista zakupów' },
  { num: '4 ✅', keyword: 'atrakcje na 18 urodziny na sali', vol: '700', serp: 'blogi', linkStrength: 'silny', title: 'Atrakcje na 18 urodziny na sali — czym zaskoczyć gości?' },
  { num: '5 ✅', keyword: 'pomysły dekoracja stołu komunijnego', vol: '600', serp: 'blogi', linkStrength: 'silny', title: 'Dekoracja stołu komunijnego — pomysły, które zrobisz sam' },
  { num: '6', keyword: 'jak zrobić kwiaty z papieru', vol: '450', serp: 'blogi/YT', linkStrength: 'słaby', title: 'Jak zrobić duże kwiaty z papieru? 5 wzorów na ściankę i dekoracje' },
  { num: '7', keyword: 'pomysły na wieczór panieński', vol: '350', serp: 'blogi', linkStrength: 'średni', title: 'Pomysły na wieczór panieński — 20 atrakcji na każdą kieszeń' },
  { num: '8 ✅', keyword: 'jak zrobić ściankę z balonów', vol: '350', serp: 'blogi/YT', linkStrength: 'silny', title: 'Jak zrobić ściankę z balonów? Stelaż, materiały i montaż' },
  { num: '9', keyword: 'nowoczesne atrakcje na wesele', vol: '350', serp: 'blogi', linkStrength: 'silny', title: 'Nowoczesne atrakcje na wesele — trendy i inspiracje 2026' },
  { num: '10 ✅', keyword: 'baby shower pomysły', vol: '250', serp: 'blogi', linkStrength: 'silny', title: 'Baby shower — pomysły na dekoracje, zabawy i prezenty' },
  { num: '11', keyword: 'jak zrobić ściankę do zdjęć', vol: '250', serp: 'blogi', linkStrength: 'silny', title: 'Jak zrobić ściankę do zdjęć tanio? 7 pomysłów na każdą okazję' },
  { num: '12 ✅', keyword: 'gender reveal pomysły', vol: '200', serp: 'blogi', linkStrength: 'silny', title: 'Gender reveal party — pomysły na niezapomniane ujawnienie płci' },
  { num: '13', keyword: 'ile kosztuje dekoracja sali weselnej', vol: '150', serp: 'blogi', linkStrength: 'silny', title: 'Ile kosztuje dekoracja sali weselnej w 2026? Realne ceny' },
  { num: '14', keyword: 'jak zorganizować baby shower', vol: '150', serp: 'blogi', linkStrength: 'silny', title: 'Jak zorganizować baby shower? Kompletny poradnik krok po kroku' },
  { num: '15', keyword: 'z czego zrobić stelaż na ściankę', vol: '150', serp: 'blogi', linkStrength: 'silny', title: 'Z czego zrobić stelaż na ściankę? Materiały, koszty i poradnik' },
  { num: '16', keyword: 'jak zrobić ściankę na 18 urodziny', vol: '150', serp: 'blogi', linkStrength: 'silny', title: 'Jak zrobić ściankę na 18 urodziny? DIY krok po kroku' },
  { num: '17', keyword: 'fotobudka diy', vol: '100', serp: 'blogi', linkStrength: 'średni', title: 'Fotobudka DIY — jak zrobić własną fotobudkę na imprezę?' },
  { num: '18', keyword: 'jak zorganizować 18 urodziny syna', vol: '100', serp: 'blogi', linkStrength: 'silny', title: 'Jak zorganizować 18 urodziny syna? Kompletna checklista' },
  { num: '19', keyword: 'co zamiast kwiatów na wesele', vol: '150', serp: 'blogi', linkStrength: 'średni', title: 'Co zamiast kwiatów na wesele? Alternatywne dekoracje ślubne' },
  { num: '20', keyword: 'dekoracje styropianowe na wesele', vol: '100', serp: 'blogi', linkStrength: 'silny', title: 'Dekoracje styropianowe na wesele — napisy, cyfry i litery 3D' },
];
