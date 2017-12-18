export default (menu) => {
    const { items = [] } = menu;
    const itemsHtml = items
        .map(item => {
            return rightClickItem(item.link, item.title, item.featured, item.showLogo);
        })
        .join('');

    return (
        `<div class="jw-rightclick jw-reset">` +
            `<ul class="jw-rightclick-list jw-reset">${itemsHtml}</ul>` +
        `</div>`
    );
};

const rightClickItem = (link = '', title = '', featured, showLogo) => {
    const logo = showLogo ? `<span class="jw-rightclick-logo jw-reset"></span>` : '';

    let content;
    if (link.name) {
        content = itemContent('span', `data-jw-name="${link.name}"`, logo, title);
    } else {
        content = itemContent('a', `href="${link}" target="_blank"`, logo, title);
    }

    return `<li class="jw-reset jw-rightclick-item ${featured ? 'jw-featured' : ''}">${content}</li>`;
};

const itemContent = (tagType, attributes, logo, title) => {
    return `<${tagType} ${attributes} class="jw-rightclick-link jw-reset">${logo}${title}</${tagType}>`;
};
