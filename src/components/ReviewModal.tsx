import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

const CREATIVE_TAGS = ['Great communicator', 'On time', 'High quality', 'Professional', 'Creative vision', 'Easy to work with', 'Detail-oriented', 'Fast delivery'];
const CLIENT_TAGS = ['Clear brief', 'Responsive', 'Fair budget', 'Respectful', 'Professional', 'Pays on time', 'Great collaboration', 'Repeat-worthy'];

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (review: ReviewPayload) => void;
  projectName: string;
  targetName: string;
  reviewType: 'creative' | 'client'; // who you're reviewing
}

export interface ReviewPayload {
  rating: number;
  tags: string[];
  text: string;
  reviewType: 'creative' | 'client';
}

const StarRating: React.FC<{ value: number; onChange: (v: number) => void }> = ({ value, onChange }) => {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1.5">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(star)}
          className="text-[32px] transition-transform duration-100 hover:scale-110 cursor-pointer bg-transparent border-none p-0"
        >
          {star <= (hover || value) ? '★' : '☆'}
        </button>
      ))}
    </div>
  );
};

export const ReviewModal: React.FC<ReviewModalProps> = ({ open, onClose, onSubmit, projectName, targetName, reviewType }) => {
  const [rating, setRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [text, setText] = useState('');

  const tags = reviewType === 'creative' ? CREATIVE_TAGS : CLIENT_TAGS;

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const handleSubmit = () => {
    if (rating === 0) return;
    onSubmit({ rating, tags: selectedTags, text, reviewType });
    setRating(0);
    setSelectedTags([]);
    setText('');
  };

  const ratingLabels = ['', 'Poor', 'Below Average', 'Good', 'Very Good', 'Excellent'];

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="sm:max-w-[480px] p-0 gap-0 rounded-[20px] overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
          <DialogTitle className="text-[18px] font-extrabold tracking-[-0.03em]">
            Leave a Review
          </DialogTitle>
          <DialogDescription className="text-[13px] text-muted-foreground mt-1">
            Rate your experience with <span className="font-semibold text-foreground">{targetName}</span> on <span className="font-semibold text-foreground">{projectName}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 py-5 space-y-6">
          {/* Star Rating */}
          <div className="text-center">
            <div className="text-[12px] font-bold uppercase tracking-[0.1em] text-muted-foreground mb-3">
              Overall Rating
            </div>
            <div className="flex justify-center">
              <StarRating value={rating} onChange={setRating} />
            </div>
            {rating > 0 && (
              <div className="text-[13px] font-semibold text-foreground mt-2 animate-in fade-in duration-200">
                {ratingLabels[rating]}
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <div className="text-[12px] font-bold uppercase tracking-[0.1em] text-muted-foreground mb-3">
              What stood out?
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`text-[11.5px] font-semibold px-3 py-1.5 rounded-full border transition-all duration-150 cursor-pointer ${
                    selectedTags.includes(tag)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-card text-muted-foreground border-border hover:border-foreground/30 hover:text-foreground'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Written Review */}
          <div>
            <div className="text-[12px] font-bold uppercase tracking-[0.1em] text-muted-foreground mb-2">
              Written Review <span className="text-muted-foreground/60 normal-case tracking-normal">(optional)</span>
            </div>
            <Textarea
              placeholder={`Share your experience working with ${targetName}…`}
              value={text}
              onChange={e => setText(e.target.value)}
              className="min-h-[100px] resize-none text-[13px] rounded-[12px]"
              maxLength={500}
            />
            <div className="text-[11px] text-muted-foreground text-right mt-1">{text.length}/500</div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose} className="rounded-full text-[12px] font-bold">
            Skip for now
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={rating === 0}
            className="rounded-full text-[12px] font-bold"
          >
            Submit Review
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
