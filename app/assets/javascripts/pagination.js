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
    <button
      class="btn btn-primary btn-like"
      data-dog=${dog.id}
      data-method=${dog.user_liked ? 'DELETE' : 'POST'}
      >
      ${dog.user_liked ? 'unlike' : 'like'}
    </buton>`;
  };

  const renderDog = dog => {
    return `
    <div>
      <a href=${dog.url}>
        <article>
          <h2 class="dog-name">${dog.name}</h2>
          <div class="feed-item">
            <img class="dog-photo" src=${
              dog.images[0]
            } style="width: auto; height: 100%;"/>
          </div>
        </article>
      </a>
      <div style="display: flex; align-items: center; width: 135px; justify-content: space-between; padding: 10px; flex-direction: row-reverse">
        <span>${dog.likes} likes</span>
        ${state.signed_in && !dog.isOwner ? renderBtn(dog) : ''}
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

  const toggleLike = btn => {
    const dog = state.dogs.filter(d => d.id == btn.dataset.dog)[0];
    dog.user_liked ? (dog.likes -= 1) : (dog.likes += 1);
    dog.user_liked = !dog.user_liked;
  };

  const addPaginatorListener = fn => {
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
          fn();
        })
        .catch(err => console.log(err));
    });
  };

  const addLikeButtonListener = fn => {
    Array.from(document.querySelectorAll('.btn-like')).forEach(btn => {
      btn.addEventListener('click', function() {
        const method = this.dataset.method;
        const url = `/dogs/${this.dataset.dog}/like.json`;
        const options = {
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: 'hello' }),
        };
        method === 'POST'
          ? fetch(url, { method, ...options }).catch(err => console.log(err))
          : fetch(url, { method }).catch(err => console.log(err));
        toggleLike(this);
        fn();
      });
    });
  };

  const renderDogs = () => {
    root.innerHTML = state.dogs
      .map((dog, i) => {
        return (i + 1) % 2 === 0
          ? `${renderDog(dog)}<div class="feed-item add"></div>`
          : renderDog(dog);
      })
      .join('');
    addLikeButtonListener(renderDogs);
  };

  fetch('/dogs.json?page=1&sorted=false')
    .then(res => res.json())
    .then(newState => {
      state = newState;
      renderDogs();
      renderPaginator();
      DOM.linkItems = Array.from(document.querySelectorAll('ul.pagination a'));
      DOM.listItems = Array.from(document.querySelectorAll('ul.pagination li'));
      addPaginatorListener(renderDogs);
    })
    .catch(e => console.log(e));
});
