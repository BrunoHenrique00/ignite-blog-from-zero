import { GetStaticProps } from 'next';
import Prismic from '@prismicio/client';
import { FiUser, FiCalendar } from 'react-icons/fi';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { useState } from 'react';
import Link from 'next/link';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import Header from '../components/Header';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  const [posts, setPosts] = useState<Post[]>(postsPagination.results);
  const [nextPage, setNextPage] = useState(postsPagination.next_page);
  const [currentPage, setCurrentPage] = useState(1);

  async function handleNextPage(): Promise<void> {
    if (currentPage !== 1 && nextPage === null) {
      return;
    }
    const postsResults = await fetch(`${nextPage}`).then(response =>
      response.json()
    );
    setNextPage(postsResults.next_page);
    setCurrentPage(postsResults.page);

    const newPosts = postsResults.results.map(post => post);

    setPosts([...posts, ...newPosts]);
  }

  return (
    <div className={commonStyles.container}>
      <Header />
      {posts.map(post => (
        <Link key={post.uid} href={`/post/${post.uid}`}>
          <a>
            <h1 className={styles.postTitle}>{post.data.title}</h1>
            <p className={styles.postSubTitle}>{post.data.subtitle}</p>
            <div className={styles.postInfo}>
              <div>
                <FiCalendar />
                <span>
                  {format(new Date(post.first_publication_date), 'PP', {
                    locale: ptBR,
                  })}
                </span>
              </div>
              <div>
                <FiUser />
                <p>{post.data.author}</p>
              </div>
            </div>
          </a>
        </Link>
      ))}

      {nextPage && (
        <button onClick={handleNextPage} className={styles.button}>
          Carregar mais posts
        </button>
      )}
    </div>
  );
}

export const getStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse: PostPagination = await prismic.query();
  return {
    props: {
      postsPagination: postsResponse,
    },
  };
};
