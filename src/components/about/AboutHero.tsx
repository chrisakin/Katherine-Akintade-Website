
export default function AboutHero() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid md:grid-cols-2 gap-12 items-start mb-12">
        <img 
          src="https://raw.githubusercontent.com/stackblitz/stackblitz-codeflow/main/assets/katherine-11.jpg"
          alt="Katherine in elegant white and blue dress"
          className="rounded-lg shadow-xl w-full object-cover"
        />
        
        <div className="space-y-6 text-gray-700">
          <p className="leading-relaxed">
            Katherine is a creative entrepreneur and the lead photographer of Images By Ayobola Studios. 
            As a "Jesus baby", Katherine's life and work are driven by a deep love for God and a desire 
            to serve others, just as Christ came to serve.
          </p>
          
          <p className="leading-relaxed">
            Her mission is to help individuals live as the fullest version of who God created them to be, 
            embracing their identity and uniqueness. Katherine specializes in identity-focused photography, 
            particularly for teenagers navigating their formative years. Through her lens, she empowers her 
            clients to see and celebrate their beauty, purpose, and value.
          </p>
        </div>
      </div>

      <div className="space-y-6 text-gray-700">
        <p className="leading-relaxed">
          Beyond photography, Katherine invests in talent development and creativity. She is the founder 
          of The Crèatale Academy, a platform dedicated to discovering and nurturing talents. Her expressions 
          span a variety of creative pursuits, including mentoring teenagers, hosting worship sessions, and 
          enhancing creativity within church communities.
        </p>
        
        <p className="leading-relaxed">
          Katherine believes in the transformative power of art, creativity, and clarity of identity. She 
          embodies the heart of a creative entrepreneur, dedicated to building and sharing intellectual and 
          creative capital. For Katherine, it's all about inspiring others to see themselves through God's 
          eyes—loved, worthy, and wonderfully unique.
        </p>
      </div>
    </div>
  );
}