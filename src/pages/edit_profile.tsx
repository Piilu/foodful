import { Heading, FormControl, FormLabel, Input, Textarea, Button, Box } from "@chakra-ui/react";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { requireAuth } from "~/utils/helpers";

export async function getServerSideProps(ctx: GetServerSidePropsContext)
{
  return await requireAuth(ctx);
}

const edit_profile = () => {
    const router = useRouter();
    const website: string = "";
    const nickname: string = "";
    const bio: string = "";
    const imageLink: string = "";
    

    return (
        <Box
        as="form"
        
        p={8}
        borderRadius="lg"
        boxShadow="base"
        maxWidth="500px"
        mx="auto"
      >
        <Heading size="lg" mb={6}>Edit Profile</Heading>
  
        <FormControl id="nickname" mb={4}>
          <FormLabel>Nickname</FormLabel>
          <Input
            type="text"
            value={nickname}     
            //onChange={(e) => setNickname(e.target.value)}       
          />
        </FormControl>

        <FormControl id="imageLink" mb={4}>
        <FormLabel>Image Link</FormLabel>
        <Input
          type="url"
          value={imageLink}
          //onChange={(e) => setImageLink(e.target.value)}
        />
      </FormControl>
  
        <FormControl id="bio" mb={4}>
          <FormLabel>Bio</FormLabel>
          <Textarea
            value={bio}   
            //onChange={(e) => setBio(e.target.value)}         
          />
        </FormControl>
  
        <FormControl id="website" mb={4}>
          <FormLabel>Website</FormLabel>
          <Input
            type="url"
            value={website}           
           // onChange={(e) => setWebsite(e.target.value)} 
          />
        </FormControl>
  
        <Button         
        loadingText='Saving'
        colorScheme="green" 
        type="submit">Save</Button>
      </Box>
        );
    };
    
    export default edit_profile;