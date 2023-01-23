#+TITLE: Prisma ORM Training
#+AUTHOR: Rahul M. Juliato
#+EMAIL: rahul.juliato@gmail.com
#+OPTIONS: toc: nil


* Intro

[[https://github.com/prisma/prisma][Important link: Prisma Github Repo]]


Prisma is a next-generation ORM that consists of these tools:

Prisma Client: Auto-generated and type-safe query builder for Node.js
& TypeScript

Prisma Migrate: Declarative data modeling & migration system

Prisma Studio: GUI to view and edit data in your database

* Setup

Start a new project

#+BEGIN_SRC bash
  npm init -y
  npm i --save-dev prisma typescript ts-node @types/node nodemon
#+END_SRC

Typescript is not obligatory but helps a LOT!

Now we create a `tsconfig.json` file (this is the one recommended):

#+BEGIN_SRC json
{
  "compilerOptions": {
    "sourceMap": true,
    "outDir": "dist",
    "strict": true,
    "lib": ["esnext"],
    "esModuleInterop": true
  }
}
#+END_SRC

Now we initialize prisma :)

#+BEGIN_SRC bash
  npx prisma init
#+END_SRC

or better

#+BEGIN_SRC bash
  npx prisma init --datasource-provider postgresql (or any other)
#+END_SRC

A prisma folder is created.

Explore it.

Explore about Generator and Data Source.

Also explore talk about .env created and .gitignore.

Explore how to make the `.prisma` file be syntax highlighted and LSP aware.

VSCode: using an extension, Prisma.

Show that altering the .prisma file and then saving we have auto
format if it is set to VSCode default.

On VSCode we can ctrl+, (command+,).

Edit the settings on JSON and show/add:

#+BEGIN_SRC json
  "[prisma]": {
    "editor.defaultFormatter": "Prisma.prisma",
    "editor.formatOnSave": true
  },
#+END_SRC

Comment to show how it can be disabled by commenting this code, making
a change and saving.

And if you do not like it when saving, you can programatically do it with:

#+BEGIN_SRC bash
npx prisma format
#+END_SRC

* The basic schema.prisma file and flow

This is a Prisma specific format.

Let's dive into it a bit.

Explain what a generator is.

Explore about providers for your generator and the `generator client`.

Explore `datasource db`.


create a model:

#+BEGIN_SRC prisma
model User {
   id   Int @id @default(autoincrement())
   name String 
}
#+END_SRC

Now we can save.

Prisma and db are completelly different stuff.

Did we changed our db by saving this file?

We need to generate a migration and push it into the database.

So we can migrate from Nothing to our model.

#+BEGIN_SRC bash
npx prisma migrate dev "message here"
#+END_SRC


Pay attention on what is returned.

It says it generated the prisma client. But in order to use it we need
an extra package.

#+BEGIN_SRC bash
  npm install @prisma/client
#+END_SRC

On every migration your client is re-generated, but if you need to
do it manually you can always force the regeneration with:

#+BEGIN_SRC bash
  npx prisma generate client
#+END_SRC

This will also return the magic lines:

#+BEGIN_SRC typescript
  import { PrismaClient } from '@prisma/client'
  const prisma = new PrismaClient()
#+END_SRC

If we create a `script.ts` file and add this lines, we can see that we
may explore this object by typing `prisma` followed by the
completition shortcut on your editor (for VSCode it is Ctrl+Space or
Command+Space).

Explore with prisma, prisma.user...

In order to make something useful from `script.ts` we'll add some
boilerplate code to deal with the async calls.

#+BEGIN_SRC typescript
    import { PrismaClient } from "@prisma/client";
    const prisma = new PrismaClient();
  
    async function main() {
       // We will explore prisma here...

    }

    main()
    .catch((e) => console.error(e.message))
    .finally(async () => {
      await prisma.$disconnect();
    });
#+END_SRC

Talk about this boilerplate and about disconnect.


Add some simple like:
#+BEGIN_SRC typescript
  const user = await prisma.user.create({ data: { name: "Rahul" } });
  console.log(user);
#+END_SRC

In order to execute it let's make some changes to our `package.json`.

Add this script:

#+BEGIN_SRC JSON
  "scripts": {
    "devStart": "nodemon script.ts"
  },
#+END_SRC

Talk about nodemon and --watch

Execute `npm run devStart`.

Change name to other names and see it in action.

Also change user to users and do:

#+BEGIN_SRC typescript
  const users = await prisma.user.findMany({});
  console.log(users);
#+END_SRC

Esse é o preview do que faz o `.prisma`.

Repassar o arquivo.

Generator => dabase => model => migrations => client

This file allows defining the db, configs it, the schema and the client.
This is a case of "Single Source of Truth".

Prisma has only ONE database.

Also do not forget to be mindiful about the .env file and generate
diff data bases for dev, production, testing, etc.

Generators we can have lots of types and be many.

* Modeling on schema.prisma (99% of what you'll need)
** Basic
Back to our `schema.prisma`.

Models represent diferent tables on your base we're data will be
stored.

Each model line is a Field, the field can have four different parts.

2 obligatory, 2 optional.

Name, Type, Field Modifiers and Attributes.

Explore the model by adding.

Let's explore the field types.

Int, String, Boolean, BigInt, Float, Decimal, DateTime, Json (some
only), Bytes, Unsupported("")

Explore that prisma can be connected to a database that already exists
and convert its schema. And if there's no relation between a db
feature and prisma, this will be marked as an Unsupported.

#+BEGIN_SRC prisma
  model User {
    id            String  @id @default(uuid())
    age           Int
    name          String
    email         String
    isAdmin       Boolean
    preferences   Json
  }
#+END_SRC

#+BEGIN_SRC prisma
  model Post {
      rating    Float
      createdAt DateTime
      updatedAt DateTime
    //author    User
  }
#+END_SRC


Then talk about adding `author User` to Post model.

Explore about what will happen if you save and how a dev should be
aware of "magic"

Let's talk about relationships.
- One to many (A post has one author and an author has many posts)
- Many to many (One post can have many categories and one category may
  have many posts)
- One to one (If a user has a table of preferences, and each
  preference has one user that links it)

We're gonna cover all.

** One to Many
A user can have many posts.

Save, see the magic, and alter to:

#+BEGIN_SRC prisma
  model User {
    id      Int     @id @default(autoincrement())
    name    String
    email   String
    isAdmin Boolean
    //  preferences Json
    Post    Post[]
  }

  model Post {
    rating    Float
    createdAt DateTime
    updatedAt DateTime
    author    User     @relation(fields: [userId], references: [id])
    userId    Int
  }
#+END_SRC

Explore first about `Post[]` the type modifier. There's only two:
- [] Array (multiple of the thing)
- ?  Optional

Explore relations to primary key in SQL.

Change userId to authorId.

Another thing we may do is use uuid() instead of autoincrement(). And so
change the type to string.

Explore what is missing on Post. Add its own Id.

The end of this part should be:

#+BEGIN_SRC prisma
model User {
  id      String  @id @default(uuid())
  name    String
  email   String
  isAdmin Boolean
  //  preferences Json
  Post    Post[]
}

model Post {
  id        String   @id @default(uuid())
  rating    Float
  createdAt DateTime
  updatedAt DateTime
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
}
#+END_SRC

** Multiple One to Many
Change User and Post models to:

#+BEGIN_SRC prisma
  model User {
    id            String  @id @default(uuid())
    name          String
    email         String
    isAdmin       Boolean
    writtenPosts  Post[]
    favoritePosts Post[]
  }

  model Post {
    id            String   @id @default(uuid())
    rating        Float
    createdAt     DateTime
    updatedAt     DateTime
    author        User     @relation(fields: [authorId], references: [id])
    authorId      String
    favoritedBy   User     @relation(fields: [favoritedById], references: [id])
    favoritedById String
  } 


#+END_SRC

Wich relation is pointint to which? This is ambiguous.

We may give a name to the Post relation and THEN refer to it on User.

Only then save it, show what happens if you save after changing post
but not inserting the relation to User.

#+BEGIN_SRC prisma
model User {
  id            String  @id @default(uuid())
  name          String
  email         String
  isAdmin       Boolean
  writtenPosts  Post[] @relation("WrittenPosts")
  favoritePosts Post[] @relation("FavoritePosts")
}

model Post {
  id            String   @id @default(uuid())
  rating        Float
  createdAt     DateTime
  updatedAt     DateTime
  author        User     @relation("WrittenPosts", fields: [authorId], references: [id])
  authorId      String
  favoritedBy   User?     @relation("FavoritePosts", fields: [favoritedById], references: [id])
  favoritedById String?
}
#+END_SRC

For the last, explore changing favoritedBy and favoritedById to optional.

This is ok for disanbiguating multiple one to many relationships. But
what about...

** Many to Many

Create the Category model and add the many to many relation to both
Category and Post.

#+BEGIN_SRC prisma
  model Category {
    id    String @id @default(uuid())
    posts Post[]
  }

  model Post {
    id            String     @id @default(uuid())
    rating        Float
    createdAt     DateTime
    updatedAt     DateTime
    author        User       @relation("WrittenPosts", fields: [authorId], references: [id])
    authorId      String
    favoritedBy   User       @relation("FavoritePosts", fields: [favoritedById], references: [id])
    favoritedById String
    categories    Category[]
  }
#+END_SRC

We don't need to make any to do any fancy @relationship, it
automatically knows the references.

And it is automatically going to create a JOIN table that is going to
hook up all this relationships for us.

All the complicated JOIN stuff we need to do to many to many
relationships is taken care by Prisma, you don't need to worry about
that at all.

** One to One

Let's create a new model, UserPreference. Since we want one to one, we can declare
the relationship on ether model. We'll do it inside UserPreferences.

#+BEGIN_SRC prisma
model UserPreference {
  id           String  @id @default(uuid())
  emailUpdates Boolean
  user User
  userId String
}
#+END_SRC

When we save it, a lot is done automatically, lets just change it a bit.

On User change the array to "one" relationship deleting [] and passing ?.

If not automatically, we need to define userId as @unique.

We know must have:
#+BEGIN_SRC prisma
model User {
  id             String          @id @default(uuid())
  name           String
  email          String
  isAdmin        Boolean
  writtenPosts   Post[]          @relation("WrittenPosts")
  favoritePosts  Post[]          @relation("FavoritePosts")
  UserPreference UserPreference?
}

model UserPreference {
  id           String  @id @default(uuid())
  emailUpdates Boolean
  user         User    @relation(fields: [userId], references: [id])
  userId       String  @unique
}  


#+END_SRC

Let's talk about the attributes we've seen so far and add @updatedAt and also
@default(now()).

We now may have a Post model like this:

#+BEGIN_SRC prisma
model Post {
  id            String     @id @default(uuid())
  rating        Float
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt
  author        User       @relation("WrittenPosts", fields: [authorId], references: [id])
  authorId      String
  favoritedBy   User       @relation("FavoritePosts", fields: [favoritedById], references: [id])
  favoritedById String
  categories    Category[]
}
#+END_SRC

** A little bit refactoring
Add title to Post. Rating to avgRating to float.

On category give a Name, string, unique.

User may have an age as Int.

We must have this now:
#+BEGIN_SRC prisma
  model User {
    id             String          @id @default(uuid())
    age            Int
    name           String
    email          String
    isAdmin        Boolean
    writtenPosts   Post[]          @relation("WrittenPosts")
    favoritePosts  Post[]          @relation("FavoritePosts")
    UserPreference UserPreference?
  }

  model UserPreference {
    id           String  @id @default(uuid())
    emailUpdates Boolean
    user         User    @relation(fields: [userId], references: [id])
    userId       String  @unique
  }

  model Post {
    id            String     @id @default(uuid())
    title         String
    avgRating     Float
    createdAt     DateTime   @default(now())
    updatedAt     DateTime   @updatedAt
    author        User       @relation("WrittenPosts", fields: [authorId], references: [id])
    authorId      String
    favoritedBy   User       @relation("FavoritePosts", fields: [favoritedById], references: [id])
    favoritedById String
    categories    Category[]
  }

  model Category {
    id    String @id @default(uuid())
    name  String @unique
    posts Post[]
  }
 #+END_SRC

** Block Level Attributes
Different of the Attributes (which are declared in rows).

The Block Level Attributes will be declared on the end of the model
using @@.

#+BEGIN_SRC prisma
  model User {
    id             String          @id @default(uuid())
    age            Int
    name           String
    email          String
    isAdmin        Boolean
    writtenPosts   Post[]          @relation("WrittenPosts")
    favoritePosts  Post[]          @relation("FavoritePosts")
    UserPreference UserPreference?

    @@unique([age, name])
    @@index([email])
    // @@index([email, name])
  }

  model UserPreference {
    id           String  @id @default(uuid())
    emailUpdates Boolean
    user         User    @relation(fields: [userId], references: [id])
    userId       String  @unique
  }

  model Post {
    id            String     @id @default(uuid())
    title         String
    avgRating     Float
    createdAt     DateTime   @default(now())
    updatedAt     DateTime   @updatedAt
    author        User       @relation("WrittenPosts", fields: [authorId], references: [id])
    authorId      String
    favoritedBy   User       @relation("FavoritePosts", fields: [favoritedById], references: [id])
    favoritedById String
    categories    Category[]

    // @@id([title, author])
  }

  model Category {
    id    String @id @default(uuid())
    name  String @unique
    posts Post[]
  }
#+END_SRC


@@unique will ad the unique constraint

@@index will help with thinks like sorting and performance

@@id (it is an option if you don't want
an conventional id but a composition of two attr)

** Enum

We can add an enum like:

#+BEGIN_SRC prisma
  enum Role {
    BASIC
    EDITOR
    ADMIN
  }
#+END_SRC

and set it to our user adding the line:

#+BEGIN_SRC prisma
  role           Role            @default(BASIC)
#+END

See why in our example we can't use enums (connector sqlite doesn't
support it).

Great advantage of being sure it will populate with the right list
item.
** Migrating
With the current schema.prisma (as in the end of "Block Level
Attributes"), we'll try to migrate with:

#+BEGIN_SRC bash
npx prisma migrate dev
#+END_SRC

An error!

Explore reading the error.

Try to delete everything with:
#+BEGIN_SRC typescript
   await prisma.user.deleteMany();
#+END_SRC

And then run the migration again.

Explore and ask the questions.

Explore the migration files and their dialects.
* Exploring the client
