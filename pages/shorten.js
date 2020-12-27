import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import css from './style.module.css';

export default function shortenUrl() {
  const [shortUrl, setShortUrl] = useState('');
  const [longUrl, setLongUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [urlStore, setUrlStore] = useState({});
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState(10000000);

  useEffect(() => {
    if (urlStore) {
      setUrlStore({ ['url']: [0, 'encodedUrl'] });
      setShortUrl(btoa(id + ''));
    }
  }, []);

  function shortener() {
    if (!urlStore.hasOwnProperty(longUrl)) {
      setShortUrl(btoa(id + ''));
      setUrlStore({ ...urlStore, [longUrl]: [id, shortUrl] });
      setId(id + 1);
      setLoading(true);
    } else {
      const newShortUrl = urlStore[longUrl][1];
      setShortUrl(newShortUrl);
    }
    setLongUrl('');
  }

  function longUrlInput(e) {
    setLongUrl(e.target.value);
    setLinkUrl(e.target.value);
  }

  return (
    <div className={css.page}>
      <Head>
        <title>Rethink Engineering Challenge</title>
      </Head>

      <header>
        <div className={css.tagline}>Rethink Engineering Challenge</div>
        <h1>Shortening Url</h1>
        <div className={css.description}>
          Let{"'"}s making Shorten Url. <br />
          Please input your url and then it will conver to shorten Url <br />
          <p>
            example : type like https://google.com or copy url from website and
            paste
          </p>
        </div>
        <div>
          <input
            type="text"
            placeholder="Write your Url"
            onChange={longUrlInput}
            value={longUrl}
          ></input>
          <button onClick={() => shortener()}>Summit</button>
          <div>
            {loading && (
              <>
                <a href={linkUrl} target="_blank">
                  rethink.com/{shortUrl}
                </a>
              </>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}
