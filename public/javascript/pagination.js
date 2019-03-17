$(function() {
  let state = {
    dogs: [],
    pages: 0,
  };

  const DOM = {};

  const root = document.querySelector('#dogs');
  const paginatorContainer = document.querySelector('#paginator-container');

  const renderBtn = dog => {
    return `
    <button class="btn btn-primary btn-like" data-dog=${dog.id}>${
      dog.user_liked ? 'unlike' : 'like'
    }</buton>`;
  };

  const renderDog = dog => {
    return `
    <div>
      <a href=${dog.url}>
        <article>
          <h2 class="dog-name">${dog.name}</h2>
          <img class="dog-photo" src=${
            dog.images[0]
          } style="width: 300px; height: auto;"/>
        </article>
      </a>
      <div style="display: flex; align-items: center; width: 135px; justify-content: space-between; padding: 10px; flex-direction: row-reverse">
        <span>${dog.likes} likes</span>
        ${state.signed_in ? renderBtn(dog) : ''}
      </div>
    </div>`;
  };

  const renderPaginatorWithTabs = tabs => {
    return `
      <ul class="pagination">
        <li><a data-nav="prev" href="#">Prev</a></li>
        ${tabs}
        <li><a data-nav="next" href="#">Next</a></li>
      </ul>`;
  };

  const createTabs = () =>
    Array(state.pages)
      .fill(null)
      .map((item, i) => {
        return `
          <li class=${!i && 'active'} data-page=${i + 1}>
            <a href="#" data-page=${i + 1}>${i + 1}</a>
          </li>`;
      })
      .join('');

  const renderDogs = () => {
    root.innerHTML = state.dogs.map(dog => renderDog(dog)).join('');
  };

  const renderPaginator = () => {
    paginatorContainer.innerHTML = renderPaginatorWithTabs(
      createTabs(state.pages)
    );
  };

  const removeAvitve = () =>
    DOM.listItems.forEach(li => li.classList.remove('active'));

  const setActive = page =>
    DOM.listItems.forEach(li => {
      if (li.dataset.page && li.dataset.page == page)
        li.classList.add('active');
    });

  const getNextPage = (dir, active) => {
    let page = dir === 'prev' ? active - 1 : active + 1;
    return page < 1 || page > DOM.listItems.length - 2 ? active : page;
  };

  const getActive = () =>
    DOM.listItems.filter(li => li.classList.contains('active'))[0].dataset.page;

  const addPaginatorListener = () => {
    document.querySelector('ul.pagination').addEventListener('click', e => {
      e.preventDefault();
      const isPage = e.target.dataset.page;
      const isNav = e.target.dataset.nav;
      const active = getActive();
      let page;

      removeAvitve();
      if (isPage) {
        page = e.target.dataset.page;
        setActive(page);
      } else if (isNav) {
        page = getNextPage(e.target.dataset.nav, parseInt(active, 10));
        setActive(page);
      }

      fetch(`/dogs.json?page=${page}&sort=${false}`)
        .then(res => res.json())
        .then(newState => {
          state.dogs = newState.dogs;
          renderDogs();
        })
        .catch(err => console.log(err));
    });
  };

  const addLikeButtonListener = () => {
    Array.from(document.querySelectorAll('.btn-like')).forEach(btn => {
      btn.addEventListener('click', function() {
        console.log(this.dataset.dog);
      });
    });
  };

  fetch('/dogs.json?page=1&sorted=false')
    .then(res => res.json())
    .then(newState => {
      state = newState;
      renderDogs();
      renderPaginator();
      DOM.linkItems = Array.from(document.querySelectorAll('ul.pagination a'));
      DOM.listItems = Array.from(document.querySelectorAll('ul.pagination li'));
      addPaginatorListener();
      addLikeButtonListener();
    })
    .catch(e => console.log(e));
});
