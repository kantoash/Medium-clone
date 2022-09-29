import { GetStaticProps } from "next";
import React, { useState } from "react";
import Header from "../../components/Header";
import { sanityClient, urlFor } from "../../sanity";
import { Post } from "../../typing";
import PortableText from "react-portable-text";
import { useForm, SubmitHandler } from "react-hook-form";
import { error } from "console";

interface IFormInput {
  _id: string;
  name: string;
  email: string;
  comment: string;
}

interface Props {
  post: Post;
}
function Post({ post }: Props) {
  
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    await fetch('/api/createComment',{
      method: 'Post',
      body: JSON.stringify(data),
    }).then(() => {
      setSubmitted(true);
    }).catch((error) => {// try cach thing
      console.log(error);
      setSubmitted(false);
    })
  };
  return (
    <main>
      <Header />
      <img
        className="w-full h-40 object-cover"
        src={urlFor(post.mainImage).url()!}
        alt=""
      />
      <article className="max-w-3xl mx-auto p-5 ">
        <h1 className="text-3xl mt-10 mb-3">{post.title}</h1>
        <h2 className="text-xl font-light text-gray-500 mb-2">
          {post.description}
        </h2>
        <div className="flex items-center space-x-2 ">
          <img
            className="h-10 w-10 rounded-full border-[1px] border-gray-500"
            src={urlFor(post.author.image).url()!}
            alt=""
          />
          <p className="font-extralight text-sm">
            Blog post by{" "}
            <span className="text-green-600"> {post.author.name}</span> -
            Published at {post._createdAt.toLocaleString()}
          </p>
        </div>
        <div>
          <PortableText
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
            content={post.body}
            serializers={{
              h1: (props: any) => (
                <h1 className="text-2xl font-bold my-5" {...props} />
              ),
              h2: (props: any) => (
                <h1 className="text-2xl font-bold my-5" {...props} />
              ),
              li: ({ children }: any) => (
                <li className="ml-4 list-disc">{children}</li>
              ),
              link: ({ href, children }: any) => (
                <a href={href} className="text-blue-500 hover:underline">
                  {children}
                </a>
              ),
            }}
          />
        </div>
        </article>

        <hr className="max-w-lg border-yellow-500 mx-auto my-5" />

        {/* only one comment is allowed */}
        {submitted ? ( // if true means already commented
          <div className='flex flex-col p-10 my-10 rounded-2xl bg-yellow-500 text-white max-w-2xl mx-auto'>
          <h3 className='text-3xl font-bold'>Thank you for submitting your comment!</h3>
          <p>Once it's approved, it will appear below!</p>
        </div>
        ) : ( // if false means can comment

        
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col p-5 max-w-2xl mx-auto mb-10 "
        >
          <h3 className="text-lg text-yellow-500 mb-4">
            Enjoyed This Article?
          </h3>
          <h4 className="text-3xl font-bold">Leave A Comment below!</h4>
          <hr className="py-3 mt-2" />
          <input
            {...register("_id")}
            type="hidden"
            name="_id"
            value={post._id}
          />
          <label className="block mb-5">
            <span className="text-gray-700">Name</span>
            <input
              {...register("name", { required: true })}
              className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 focus:ring outline-none"
              placeholder="Name"
              type="text"
            />
          </label>
          <label className="block mb-5">
            <span className="text-gray-700">Email</span>
            <input
              {...register("email", { required: true })}
              className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 focus:ring outline-none"
              placeholder="Email"
              type="email"
            />
          </label>
          <label className="block mb-5">
            <textarea
              {...register("comment", { required: true })}
              className="shadow border rounded w-full py-2 px-3 outline-none focus:ring ring-yellow-500 form-textarea mt-1 block"
              placeholder="Comment"
              rows={8}
            />
          </label>
          {/* errors will retrun when field validation fails */}
          <div className="flex flex-col p-5">
            {errors.name && (
              <span className="text-red-500">-Name Field is Required</span>
            )}
            {errors.email && (
              <span className="text-red-500">-Email Field is Required</span>
            )}
            {errors.comment && (
              <span className="text-red-500">-Comment Field is Required</span>
            )}
          </div>
          <input
            className="shadow focus:shadow-inner focus:outline-none text-white font-bold bg-yellow-500 hover:bg-yellow-300 py-3 px-5 rounded-lg cursor-pointer"
            type="submit"
          />
        </form>
        )}
        {/* Comment */}
        <div className='flex flex-col p-10 my-10 max-w-2xl mx-auto shadow-yellow-500 shadow space-y-2'>
        <h3 className='text-4xl'>Comments</h3>
        <hr className='pb-2'/>

        {post.comments.map((comment) => (
          <div key={comment._id}>
            <p><span className='text-yellow-500'>{comment.name}</span>: {comment.comment}</p>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Post;

export const getStaticPaths = async () => {
  // pre-fetch all routes with a query from Sanity CMS to find all posts for us
  // GROQ syntax from Sanity CMS
  const query = `*[_type == "post"]{
        _id,
        slug{
            current
        }
    }`;
  const posts = await sanityClient.fetch(query);

  // figure out the paths
  // we need to pass Next.js the paths as an array where each object
  // has a key called params and then the path inside of it
  // this creates a list of paths. this is the structure Next.js expects
  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }));

  return {
    paths,
    // show 404 page if it doesn't exist
    fallback: "blocking",
  };
};

// destructure context to get params out
export const getStaticProps: GetStaticProps = async ({ params }) => {
  // query for post
  // the slug is a placeholder for the actual slug
  // this will return an array back and [0] specifies the first post
  const query = `*[_type == "post" && slug.current == $slug][0]{
    _id,
    _createdAt,
    title,
    author-> {
      name,
      image
    },
    'comments': *[
      _type == "comment" &&
      post._ref == ^._id &&
      approved == true],
    description,
    mainImage,
    slug,
    body
  }`;
  // pass in value to replace slug placeholder
  const post = await sanityClient.fetch(query, {
    slug: params?.slug,
  });

  // return a 404 page if page isn't found
  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
    },
    // after 60 seconds, update the old cached version
    revalidate: 60,
  };
};
