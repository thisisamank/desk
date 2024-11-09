import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import folder from "@/../public/assets/folder-logo.svg";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useState } from "react";

export function UploadYoutubePlaylist({
  uploadPlaylist,
}: {
  uploadPlaylist: (url: string, CourseName: string) => Promise<void>;
}) {
  const [courseName, setCourseName] = useState<string>();
  const [playlistUrl, setPlaylistUrl] = useState<string>();
  const [isUploading, setIsUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false); 

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <div
          className="py-3 px-5 space-x-2 bg-[#F8FAFC] rounded-full container-center w-auto cursor-pointer"
          onClick={() => setIsDialogOpen(true)} 
        >
          <Image src={folder} alt="folder-logo" />
          <h1 className="font-semibold text-[#475569] text-sm">
            Add a Youtube Playlist
          </h1>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Playlist from Youtube</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="coursename" className="text-right">
              Course Name
            </Label>
            <Input
              onChange={(e) => setCourseName(e.target.value)}
              id="course_name"
              placeholder="Namaste Javascript"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="playlisturl" className="text-right">
              Playlist URL
            </Label>
            <Input
              onChange={(e) => setPlaylistUrl(e.target.value)}
              id="playlist_url"
              placeholder="https://www.youtube.com/playlist?list=PLRAV69dS1uWQGDQoBYMZWKjzuhCaOnBpa"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={async () => {
              if (!courseName || !playlistUrl) return;
              setIsUploading(true);
              await uploadPlaylist(playlistUrl, courseName);
              setIsUploading(false);
              setIsDialogOpen(false); 
            }}
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
