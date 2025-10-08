// Demo catalog (poster paths must exist under /assets/img/posters/)
const _CATALOG = [
    { key:"inception", title:"Inception", genres:["Sci-Fi","Thriller"], runtime:"2h 28m",
      summary:"A thief enters dreams to steal secrets.", poster:"assets/img/posters/inception.jpg", platform:"Netflix" },
    { key:"la_la_land", title:"La La Land", genres:["Romance","Musical"], runtime:"2h 8m",
      summary:"Love and ambition collide in LA.", poster:"assets/img/posters/la_la_land.jpg", platform:"Max" },
    { key:"get_out", title:"Get Out", genres:["Horror","Thriller"], runtime:"1h 44m",
      summary:"A weekend trip reveals a dark secret.", poster:"assets/img/posters/get_out.jpg", platform:"Hulu" },
    { key:"dune", title:"Dune", genres:["Sci-Fi","Adventure"], runtime:"2h 35m",
      summary:"A young man must protect his family’s future.", poster:"assets/img/posters/dune.jpg", platform:"Max" },
    { key:"past_lives", title:"Past Lives", genres:["Drama","Romance"], runtime:"1h 46m",
      summary:"Childhood friends reunite decades later.", poster:"assets/img/posters/past_lives.jpg", platform:"Prime Video" },
    { key:"into_spiderverse", title:"Spider-Verse", genres:["Animation","Action"], runtime:"1h 57m",
      summary:"Miles discovers the multiverse.", poster:"assets/img/posters/spiderverse.jpg", platform:"Netflix" },
    { key:"barbie", title:"Barbie", genres:["Comedy","Fantasy"], runtime:"1h 54m",
      summary:"Barbie leaves Barbieland for the real world.", poster:"assets/img/posters/barbie.jpg", platform:"Max" },
    { key:"oppenheimer", title:"Oppenheimer", genres:["Drama","Historical"], runtime:"3h 0m",
      summary:"The story of the atomic bomb’s creator.", poster:"assets/img/posters/oppenheimer.jpg", platform:"Peacock" },
  ];
  
  function wtCatalog() {
    return _CATALOG.slice(); // return a copy
  }
  function wtAllGenres() {
    const s = new Set();
    _CATALOG.forEach(m => m.genres.forEach(g => s.add(g)));
    return Array.from(s).sort();
  }
  