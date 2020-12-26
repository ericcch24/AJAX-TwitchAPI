function getGames(cb) {
  const request = new XMLHttpRequest();
  request.open('GET', 'https://api.twitch.tv/kraken/games/top?limit=5', true);
  request.setRequestHeader('Client-ID', '1oymoviz1aa1vi91cj12n1nisqs5ay');
  request.setRequestHeader('Accept', 'application/vnd.twitchtv.v5+json');
  request.onload = () => {
    if (request.status >= 200 && request.status < 400) {
      let res;
      try {
        res = JSON.parse(request.response);
        cb(res);
      } catch (error) {
        console.error('抓取失敗', error);
      }
    }
  };
  request.send();
}

function getStreams(name, cb) {
  const xhr = new XMLHttpRequest();
  xhr.open(
    'GET',
    `https://api.twitch.tv/kraken/streams/?game=${encodeURIComponent(name)}`,
    true
  );
  xhr.setRequestHeader('Client-ID', '1oymoviz1aa1vi91cj12n1nisqs5ay');
  xhr.setRequestHeader('Accept', 'application/vnd.twitchtv.v5+json');
  xhr.onload = () => {
    if (xhr.status >= 200 && xhr.status < 400) {
      let res;
      try {
        res = JSON.parse(xhr.response);
        cb(res);
      } catch (error) {
        console.error('抓取失敗', error);
      }
    }
  };
  xhr.send();
}

function appendStreams(topLive) {
  const container = document.querySelector('.stream');
  for (let i = 0; i < 20; i += 1) {
    const div = document.createElement('div');
    div.classList.add('stream__box');
    div.innerHTML = `
    <img class="picture" src="${topLive.streams[i].preview.medium}"></img>
    <div class="user">
      <img class="avatar" src="${topLive.streams[i].channel.logo}"></img>
      <div class="word">
        <div class="content">${topLive.streams[i].channel.status}</div>
        <div class="name">${topLive.streams[i].channel.name}</div>
      </div>
    </div>
    `;
    container.appendChild(div);
  }
}

function addEmptyBox() {
  const box = document.createElement('div');
  box.classList.add('stream__box__empty');
  document.querySelector('.stream').appendChild(box);
}

getGames((games) => {
  const topGames = games.top.map((game) => game.game.name);
  for (let i = 0; i < topGames.length; i += 1) {
    const list = document.createElement('li');
    list.innerHTML = topGames[i];
    document.querySelector('.navbar__list').appendChild(list);
  }
});

document.querySelector('.navbar__list').addEventListener('click', (e) => {
  if (e.target.tagName.toLowerCase() === 'li') {
    const text = e.target.innerText;
    document.querySelector('.game-page__topic').innerText = text;
    document.querySelector('.stream').innerHTML = '';
    getStreams(text, (data) => {
      appendStreams(data);
      addEmptyBox();
      addEmptyBox();
    });
  }
});
