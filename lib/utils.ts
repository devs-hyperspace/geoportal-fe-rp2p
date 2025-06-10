import { type ClassValue, clsx } from "clsx"
import { Map } from "maplibre-gl";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(isoString:string) {
  const date = new Date(isoString);

  // Convert to UTC+7
  const offsetMillis = 7 * 60 * 60 * 1000; // UTC+7 offset in milliseconds
  const localDate = new Date(date.getTime() + offsetMillis);

  const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
  ];

  const month = monthNames[localDate.getUTCMonth()];
  const day = localDate.getUTCDate();
  const year = localDate.getUTCFullYear();

  let hour = localDate.getUTCHours();
  const minute = localDate.getUTCMinutes().toString().padStart(2, '0');

  const daySuffix = (day:number) => {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
          case 1:  return "st";
          case 2:  return "nd";
          case 3:  return "rd";
          default: return "th";
      }
  };

  return `${month} ${day}${daySuffix(day)}, ${year} (${hour}:${minute})`;
}


export function toTitleCase(str: string): string {
    return str
      .toLowerCase()
      .replace(/_/g, ' ')        // Replace underscores with spaces
      .replace(/\b\w/g, (char) => char.toUpperCase());  // Capitalize the first letter of each word
  }

export function substringText(text:string, maxLength:number) {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + "...";
    }
    return text;
}

export const formatExecTime = (execTime:any) => {
    const date = new Date(execTime);
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hour12: false, minute: '2-digit' };
    return date.toLocaleString('en-US', options as any).replace(',', ''); // Replace comma for better formatting
};


export const genMarkerImages = (color: string): string => {
    // Remove '#' if it exists
    const imgColor = color.replace('#', '');
    // Generate URL with the color
    const imgUrl = `https://img.icons8.com/ios-filled/30/${imgColor}/volcano.png`
    
    // Return the URL
    return imgUrl;
}

export const genPoiMarkerImages = (color: string): string => {
    // Remove '#' if it exists
    const imgColor = color.replace('#', '');
    // Generate URL with the color
    const imgUrl = `https://img.icons8.com/ios-filled/30/${imgColor}/visit.png`;
    
    // Return the URL
    return imgUrl;
}

export function hexToRgba(hex:string, alpha = 1) {
    // Remove the '#' if present
    hex = hex.replace(/^#/, '');
  
    // Parse r, g, b values
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
  
    // Return RGBA string
    return `${r}, ${g}, ${b}`;
  }
  export const createPulsingDot = (map: maplibregl.Map, color: string, layer: string, pulseState: 'active' | 'inactive') => {
    const size = 100;

    // Create an Image object for the SVG icon
    const svgIcon = new Image();

    if(layer === 'volcano') {
        svgIcon.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mountain-snow"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/><path d="M4.14 15.08c2.62-1.57 5.24-1.43 7.86.42 2.74 1.94 5.49 2 8.23.19"/></svg>
        `);
    } else if(layer === 'earthquake') {
        svgIcon.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-activity"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/></svg>
        `);
    } else if(layer === 'groundmovement') {
        svgIcon.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-rail-symbol"><path d="M5 15h14"/><path d="M5 9h14"/><path d="m14 20-5-5 6-6-5-5"/></svg>
        `);
    }

    return {
        width: size,
        height: size,
        data: new Uint8Array(size * size * 4),
        context: null as CanvasRenderingContext2D | null, // Define context type explicitly

        onAdd: function () {
            const canvas = document.createElement('canvas');
            canvas.width = this.width;
            canvas.height = this.height;
            this.context = canvas.getContext('2d'); // Get the canvas context
        },

        render: function () {
            if (!this.context) return; // Ensure context is available

            const duration = 1000;
            const t = (performance.now() % duration) / duration;

            const radius = (size / 2) * 0.3;
            const outerRadius = pulseState === 'active' ? (size / 2) * 0.7 * t + radius : radius; // Control pulse based on state
            const opacity = pulseState === 'active' ? 1 - t : 1; // Control pulse opacity based on state
            const context = this.context;

            context.clearRect(0, 0, this.width, this.height);

            // Draw the outer circle (pulsing effect depends on the pulseState)
            context.beginPath();
            context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2);
            context.fillStyle = `rgba(${hexToRgba(color)}, ${opacity})`; // Use the color parameter
            context.fill();

            // Draw the inner circle
            context.beginPath();
            context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
            context.fillStyle = `rgba(${hexToRgba(color)}, 1)`; // Use the color parameter
            context.strokeStyle = 'black';
            context.lineWidth = 2 + (pulseState === 'active' ? 4 * (1 - t) : 2); // Control pulse lineWidth based on state
            context.fill();
            context.stroke();

            // Draw the SVG icon in the center of the pulsing dot
            const iconSize = 24; // Set the size of the icon
            context.drawImage(
                svgIcon,
                (this.width - iconSize) / 2, // Center the icon horizontally
                (this.height - iconSize) / 2, // Center the icon vertically
                iconSize,
                iconSize
            );

            // Update the image data
            this.data = context.getImageData(0, 0, this.width, this.height).data as any;
            map.triggerRepaint();
            return true;
        }
    };
};

export function urlToObject(url: string) {
    const [baseUrl, queryString] = url.split('?');
    const params = queryString 
        ? queryString.split('&').reduce((acc: Record<string, string>, param: string) => {
            const [key, value] = param.split('=');
            acc[decodeURIComponent(key)] = decodeURIComponent(value || '');
            return acc;
        }, {}) 
        : {};

    return {
        baseUrl,
        params
    };
}

export function objectToUrl(baseUrl: string, params: Record<string, string>) {
    const queryString = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&');

    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}
