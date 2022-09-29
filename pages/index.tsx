import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Banner from "../components/Banner";
import Header from "../components/Header";
import { sanityClient, urlFor } from "../sanity";
import { Post } from "../typing";

interface Props {
  posts: Post[];
}
export default function Home({ posts }: Props) {

  return (
    <div className="max-w-7xl mx-auto">
      <Head>
        <title>Medium2.0</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* Header */}
      <Header />
      {/* banner */}
      <Banner />
      {/* post part */}
      {/* post i fetch from sanity  */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 lg:gap-8 lg:p-4">
        {posts.map((item) => (
          <Link key={item._id} href={`/post/${item.slug.current}`}>
            <div className="group cursor-pointer border-[1px] rounded-xl overflow-hidden">
              <img className="h-60 w-full object-cover group-hover:scale-105 transition-transform duration-150 ease-in-out rounded-lg" src={urlFor(item.mainImage).url()!} alt="" />
              <div className="flex justify-between p-5 bg-white">
                <div>
                  <p className="font-bold text-lg">{item.title}</p>
                  <p className="text-sm">
                    {item.description} by {item.author.name}
                  </p>
                  </div>
                  <img
                    className="h-12 w-12 rounded-full border-[1px] border-black"
                     src={urlFor(item.author.image).url()!}
                    alt=""
                  />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export const getServerSideProps = async () => {
  const query = `*[_type == "post"]{
    _id,
   title,
    author -> {
    name,
    image
  },
  description,
  mainImage,
  slug
  }`;
  const posts = await sanityClient.fetch(query);
  return {
    props: {
      posts,
    },
  };
};
