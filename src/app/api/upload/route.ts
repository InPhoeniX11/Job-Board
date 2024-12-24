import {PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {NextRequest} from "next/server";
import uniqid from 'uniqid';

export async function POST(req: NextRequest) {


try{


  const data = await req.formData();
  const file = data.get('file') as File;

  const s3Client = new S3Client({
    region: 'eu-north-1', // Change to the bucket's region
    endpoint: 'https://s3.eu-north-1.amazonaws.com', 
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY as string,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
    },
  });


  //name 345234523-test.jpg
  const newFilename = `${uniqid()}-${file.name}`;

  // blob data of our file
  const chunks = [];
  // @ts-ignore
  for await (const chunk of file.stream()) {
    chunks.push(chunk);
  }
  const buffer = Buffer.concat(chunks);

  const bucketName = 'sudhanshu-job-board';
  await s3Client.send(new PutObjectCommand({
    Bucket: bucketName,
    Key: newFilename,
    ACL: 'public-read',
    Body: buffer,
    ContentType: file.type,
  }));

  return Response.json({
    newFilename,
    url: `https://${bucketName}.s3.amazonaws.com/${newFilename}`,
  });
}
catch (error) {
  console.error('Error in file upload:', error);
  return Response.json(
    { error: 'Internal Server Error' },
    { status: 500 }
  );
}
}
