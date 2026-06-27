async function loadPublications() {
  const response = await fetch("publications.json");
  const publications = await response.json();

  publications.sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const container = document.getElementById("publications");

  let currentYear = null;

  publications.forEach(pub => {
    const year = new Date(pub.date).getFullYear();

    // Cabecera de año
    if (year !== currentYear) {
      currentYear = year;

      const h2 = document.createElement("h2");
      h2.className = "year-heading";
      h2.textContent = year;
      container.appendChild(h2);
    }

    // Tarjeta
    const card = document.createElement("div");
    card.className = "card";

    // Título
    const title = document.createElement("div");
    title.className = "pub-title";
    title.innerHTML = `
      ${pub.authors} (${year}).
      ${pub.title}
    `;
    card.appendChild(title);

    // Detalles
    const details = document.createElement("div");
    details.className = "pub-details";

    let citation =
      `${pub.journal}, ${pub.issue}`;

    if (pub.pages) {
      citation += `, ${pub.pages}`;
    }

    citation += ".";

    if (pub.doi) {
      citation += `
        <a
          href="https://doi.org/${pub.doi}"
          target="_blank"
        >
          doi:${pub.doi}
        </a>
      `;
    } else if (pub.doiUrl) {
      citation += `
        <a
          href="${pub.doiUrl}"
          target="_blank"
        >
          Full text
        </a>
      `;
    }

    details.innerHTML = citation;
    card.appendChild(details);

    // Badges
    if (pub.badges?.length) {
      const badges = document.createElement("div");
      badges.className = "badges";

      pub.badges.forEach(badge => {
        const a = document.createElement("a");

        a.className =
          `badge ${badge.class ?? ""}`;

        a.textContent = badge.text;

        if (badge.url) {
          a.href = badge.url;
          a.target = "_blank";
        }

        badges.appendChild(a);
      });

      card.appendChild(badges);
    }

    container.appendChild(card);
  });
}

loadPublications();