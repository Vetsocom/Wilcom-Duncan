import { Play } from "lucide-react";

interface VideoEmbedGridProps {
  videos: string[];
}

export function VideoEmbedGrid({ videos }: VideoEmbedGridProps) {
  if (!videos || videos.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {videos.map((video, index) => (
        <div key={index} className="relative aspect-video overflow-hidden rounded-xl bg-midnight border border-slate/20 flex flex-col items-center justify-center group cursor-pointer hover:border-gold/30 transition-colors">
          <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Play className="text-gold ml-1" size={24} />
          </div>
          <span className="text-slate/50 text-sm font-mono opacity-50 relative z-10 break-all p-2 text-center">
<iframe src="https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fweb.facebook.com%2Freel%2F622874176873553%2F&show_text=false&width=267&t=0" width="267" height="476" style={{ border: "none", overflow: "hidden" }} scrolling="no" frameBorder="0" allowFullScreen={true} allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" ></iframe>
<iframe src="https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fweb.facebook.com%2F61552823529686%2Fvideos%2F744030521187168%2F&show_text=false&width=357&t=0" width="357" height="476" style={{ border: "none", overflow: "hidden" }} scrolling="no" frameBorder="0" allowFullScreen={true} allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>
          </span>
        </div>
      ))}
    </div>
  );
}
