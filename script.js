// SwissMate Travel Planner Bot - Unified Chat Experience
class SwissMate {
    constructor() {
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.loadingSpinner = document.getElementById('loadingSpinner');
        
        // Flowise API configuration
        this.flowiseConfig = {
            chatflowid: "8c03ae2b-beed-49ff-8c39-9d7ff8bf228d",
            apiHost: "https://limeutr-flowise.hf.space"
        };
        
        this.init();
    }

    init() {
        // Add event listeners
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        this.sendButton.addEventListener('click', () => {
            this.sendMessage();
        });

        // Auto-resize chat input
        this.messageInput.addEventListener('input', () => {
            this.messageInput.style.height = 'auto';
            this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 120) + 'px';
        });

        // Swiss travel context for better responses
        this.swissContext = {
            destinations: [
                'Zermatt', 'Interlaken', 'Zurich', 'Geneva', 'Bern', 'Lucerne', 
                'Grindelwald', 'Montreux', 'St. Moritz', 'Lausanne', 'Basel'
            ],
            activities: [
                'skiing', 'hiking', 'train rides', 'chocolate tours', 'cheese making',
                'mountain climbing', 'lake cruises', 'alpine adventures', 'city tours'
            ],
            cuisine: [
                'fondue', 'raclette', 'rösti', 'chocolate', 'cheese', 'Swiss wine',
                'alpine herbs', 'traditional pastries', 'local specialties'
            ],
            culture: [
                'Swiss precision', 'watchmaking', 'banking', 'neutrality', 'multilingual',
                'Swiss German', 'French', 'Italian', 'Romansh', 'Alpine traditions'
            ]
        };
    }

    async sendMessage(customMessage = null) {
        const message = customMessage || this.messageInput.value.trim();
        
        if (!message) return;

        // Add user message to chat
        this.addMessage(message, 'user');
        
        // Clear input
        if (!customMessage) {
            this.messageInput.value = '';
            this.messageInput.style.height = 'auto';
        }

        // Show loading
        this.showLoading(true);

        try {
            // Try Flowise API first
            const response = await this.callFlowiseAPI(message);
            
            if (response && response.trim() && response.length > 50) {
                // Add bot response to chat
                this.addMessage(response, 'bot');
            } else {
                // Use fallback for better responses
                const fallbackResponse = this.generateSwissFallbackResponse(message);
                this.addMessage(fallbackResponse, 'bot');
            }
            
        } catch (error) {
            console.error('Error sending message:', error);
            
            // Fallback to Swiss travel knowledge
            const fallbackResponse = this.generateSwissFallbackResponse(message);
            this.addMessage(fallbackResponse, 'bot');
        } finally {
            this.showLoading(false);
        }
    }

    async callFlowiseAPI(message) {
        const enhancedMessage = this.enhanceMessageWithSwissContext(message);
        
        const requestBody = {
            question: enhancedMessage,
            history: [],
            overrideConfig: {
                sessionId: this.generateSessionId()
            }
        };

        const response = await fetch(`${this.flowiseConfig.apiHost}/api/v1/prediction/${this.flowiseConfig.chatflowid}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.text || data.answer || data.response || '';
    }

    enhanceMessageWithSwissContext(message) {
        return `As SwissMate, your premium Swiss travel concierge, provide detailed, personalized advice about Swiss travel. 

Context: You are an expert on Swiss destinations, culture, cuisine, and experiences. Always maintain enthusiasm for Switzerland and provide practical, luxurious travel recommendations.

User question: ${message}

Please provide a comprehensive, friendly response that includes:
- Specific Swiss recommendations
- Practical travel tips
- Cultural insights
- Luxury experiences when relevant
- Cost estimates when helpful

Keep the tone warm, professional, and authentically Swiss (use occasional German/French phrases like "Grüezi" or "Merci").`;
    }

    generateSwissFallbackResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Specific button responses first
        if (lowerMessage.includes('best luxury destinations in switzerland')) {
            return `🏔️ **Switzerland's Most Luxurious Destinations**

Here are the crown jewels of Swiss luxury travel:

**🏔️ Zermatt & Matterhorn**
- **Hotels**: The Omnia, Mont Cervin Palace, Grand Hotel Zermatterhof
- **Experiences**: Helicopter tours, private skiing, glacier dining
- **Why Visit**: Car-free village, iconic Matterhorn views, world-class skiing

**🏙️ St. Moritz**
- **Hotels**: Kulm Hotel, Badrutt's Palace, Carlton Hotel
- **Experiences**: Championship skiing, luxury shopping, gourmet dining
- **Why Visit**: Birthplace of winter tourism, celebrity hotspot, pristine lakes

**🍷 Gstaad**
- **Hotels**: The Alpina Gstaad, Gstaad Palace, Le Grand Bellevue
- **Experiences**: Private chalets, exclusive spas, Michelin dining
- **Why Visit**: Discreet luxury, stunning Alpine scenery, world-class wellness

**🏨 Luxury Amenities**: 
- Private helicopter transfers
- Michelin-starred restaurants
- Exclusive spa treatments
- Personal concierge services

*Ready to experience Swiss luxury at its finest?* 🇨🇭✨`;
        }
        
        if (lowerMessage.includes('create a 7-day luxury swiss itinerary')) {
            return `📅 **7-Day Luxury Swiss Itinerary - "Alpine Grandeur Experience"**

**Day 1-2: Zürich Sophistication**
- **Stay**: Baur au Lac or The Dolder Grand
- **Activities**: Private city tour, Bahnhofstrasse shopping, art galleries
- **Dining**: Restaurant Pavillon (Michelin), Kronenhalle (celebrity hotspot)

**Day 3-4: Lucerne & Mount Pilatus**
- **Stay**: Hotel des Balances or Palace Luzern
- **Activities**: Private yacht on Lake Lucerne, Pilatus golden gondola
- **Dining**: Restaurant Balances, Focus Terra

**Day 5-7: Zermatt & Matterhorn**
- **Stay**: The Omnia or Mont Cervin Palace
- **Activities**: Helicopter Matterhorn tour, Gornergrat railway, glacier skiing
- **Dining**: After Seven (14 GaultMillau points), Cervo Puro

**🚄 Luxury Transportation**:
- First-class Swiss Travel Pass
- Private helicopter transfers
- Chauffeur-driven vehicles

**💰 Estimated Budget**: CHF 8,000-15,000 per person
**✨ VIP Services**: Personal concierge, private guides, exclusive experiences

*Shall I customize this further for your preferences?* 🏔️`;
        }
        
        if (lowerMessage.includes('swiss fine dining and culinary experiences')) {
            return `🍽️ **Swiss Culinary Excellence - A Gastronomic Journey**

**🌟 Michelin-Starred Restaurants**:

**Restaurant de l'Hôtel de Ville (Crissier)** - 3 Michelin Stars
- Chef: Franck Giovannini
- Signature: Modern French cuisine with Swiss influences
- Experience: 19 GaultMillau points, wine cellar tours

**Schauenstein (Fürstenau)** - 3 Michelin Stars  
- Chef: Andreas Caminada
- Signature: Creative Alpine cuisine in a castle setting
- Experience: Farm-to-table philosophy, stunning Grisons location

**The Restaurant (Zürich)** - 2 Michelin Stars
- Chef: Marcus Lindner
- Signature: Contemporary European with Swiss touches
- Experience: Elegant atmosphere, exceptional wine pairings

**🧀 Traditional Swiss Experiences**:
- **Fondue Masterclass**: Learn authentic Gruyère preparation
- **Raclette Tastings**: Alpine cheese melting traditions
- **Chocolate Workshops**: Lindt, Läderach, Sprüngli factories

**🍷 Wine Regions**:
- **Lavaux**: UNESCO vineyard terraces, Chasselas wines
- **Valais**: Petite Arvine, Humagne varieties
- **Ticino**: Merlot del Ticino, Italian-Swiss fusion

**💎 Exclusive Culinary Tours**:
- Private chef experiences
- Wine cave visits
- Traditional Alpine farm dinners

*Bon appétit! Which culinary adventure calls to you?* 🇨🇭`;
        }
        
        if (lowerMessage.includes('exclusive swiss experiences and activities')) {
            return `⭐ **Exclusive Swiss VIP Experiences**

**🚁 Helicopter Adventures**:
- **Matterhorn Glacier Landing**: Private helicopter, champagne service
- **Jungfraujoch VIP Tour**: Skip-the-line access, exclusive glacier restaurant
- **Swiss Alps Grand Tour**: Multi-peak helicopter safari

**🎿 Private Winter Experiences**:
- **Exclusive Ski Instruction**: Olympic coaches, private slopes
- **Snow Limousine Tours**: Luxury vehicle mountain access
- **Ice Palace Dining**: Private meals in glacier caves

**🏔️ Summer Alpine Exclusives**:
- **Via Ferrata Adventures**: Guided climbing with luxury base camps
- **Private Train Charters**: Exclusive Glacier Express journeys
- **Alpine Wellness Retreats**: Spa treatments at 3,000m altitude

**🏨 Luxury Accommodations**:
- **Private Chalets**: Entire luxury properties with staff
- **Presidential Suites**: Top-floor views, personal butlers
- **Glamping Experiences**: Luxury camping under Alpine stars

**🍾 Bespoke Services**:
- **Personal Concierge**: 24/7 Swiss travel expert
- **Private Shopping**: Exclusive boutique access
- **Cultural Immersion**: Meet local artisans, private museum tours

**💰 Investment**: CHF 2,000-10,000+ per experience
**🎯 Availability**: Limited seasonal bookings

*Which exclusive experience would make your Swiss dreams come true?* ✨`;
        }
        
        // Destination-specific button responses
        if (lowerMessage.includes('plan a luxury trip to zermatt and matterhorn')) {
            return `🏔️ **Luxury Zermatt & Matterhorn Experience**

**🏨 Ultra-Luxury Accommodations**:
- **The Omnia**: Design hotel with Matterhorn views, CHF 800-1,500/night
- **Mont Cervin Palace**: Historic 5-star, butler service, CHF 600-1,200/night
- **Grand Hotel Zermatterhof**: Traditional elegance, CHF 400-800/night

**🚁 Exclusive Experiences**:
- **Helicopter Matterhorn Landing**: Private glacier dining, CHF 1,200/person
- **Sunrise Gornergrat**: Private railway car, champagne breakfast, CHF 300/person
- **Theodul Glacier Skiing**: Year-round skiing at 3,883m, CHF 150/day

**🍽️ Michelin Dining**:
- **After Seven**: 14 GaultMillau points, tasting menu CHF 180
- **Cervo Puro**: Mountain-modern cuisine, CHF 120/person
- **Restaurant Whymper-Stube**: Traditional Alpine, CHF 80/person

**🎿 Premium Activities**:
- **Private Ski Lessons**: Olympic instructors, CHF 200/hour
- **Backcountry Ski Tours**: Guided adventures, CHF 400/day
- **Alpine Wellness**: Spa treatments with mountain views

**🚄 Arrival**: 
- Train from Visp (scenic route) or helicopter from Zürich
- Car-free village - electric taxis only

**💰 Budget**: CHF 1,500-3,000 per person per day
**⭐ Best Time**: Dec-Apr skiing, Jun-Oct hiking

*Ready for the ultimate Matterhorn luxury experience?* 🇨🇭`;
        }
        
        if (lowerMessage.includes('best adventure experiences in interlaken')) {
            return `🪂 **Interlaken Adventure Paradise**

**🪂 Adrenaline Adventures**:
- **Paragliding**: Tandem flights over Lakes Thun & Brienz, CHF 180-280
- **Skydiving**: 15,000ft freefall with Alpine views, CHF 450-650
- **Bungee Jumping**: 134m Verzasca Dam jump, CHF 255
- **Canyoning**: Waterfall rappelling, CHF 115-145

**🏔️ Mountain Excursions**:
- **Jungfraujoch**: "Top of Europe" train journey, CHF 75-210
- **Schilthorn**: 007 Bond filming location, CHF 71-96
- **Harder Kulm**: Sunset views over Interlaken, CHF 32

**🚢 Lake Activities**:
- **Private Yacht Charter**: Lake Thun luxury cruise, CHF 800-1,200/day
- **Wakeboarding**: Professional instruction, CHF 85/hour
- **Stand-up Paddleboarding**: Peaceful lake exploration, CHF 35/hour

**🏨 Adventure Base Camps**:
- **Victoria Jungfrau Grand Hotel & Spa**: Luxury recovery, CHF 400-800/night
- **Hotel Interlaken**: Historic charm, CHF 200-400/night
- **Boutique Hotels**: Cozy Alpine retreats, CHF 150-300/night

**🍽️ Refuel Stops**:
- **Restaurant Taverne**: Traditional Swiss cuisine
- **Hütte Bar**: Après-adventure drinks
- **Café de Paris**: Lakeside dining

**💡 Pro Tips**:
- Book activities 2-3 days in advance
- Weather-dependent - have backup plans
- Combination packages available

*Which adventure will get your heart racing?* 🏔️⚡`;
        }
        
        if (lowerMessage.includes('luxury experiences in zurich switzerland')) {
            return `🏙️ **Zürich Luxury Experiences**

**🛍️ World-Class Shopping**:
- **Bahnhofstrasse**: Most expensive shopping mile, luxury brands
- **Jelmoli**: Switzerland's largest department store
- **Boutique Districts**: Niederdorf, Oberstrass exclusive shops
- **Private Shopping Tours**: Personal stylist, VIP access

**🍽️ Michelin Excellence**:
- **The Restaurant**: 2 Michelin stars, contemporary European
- **Pavillon**: Baur au Lac hotel, classic French cuisine
- **Kronenhalle**: Celebrity hotspot, traditional Swiss-French

**🎨 Cultural Sophistication**:
- **Kunsthaus Zürich**: World-class art collection
- **Zürich Opera House**: Private box bookings available
- **FIFA World Football Museum**: Interactive experiences
- **Private Art Tours**: Gallery hopping with experts

**🏨 Luxury Accommodations**:
- **Baur au Lac**: Legendary 5-star, lakefront location
- **The Dolder Grand**: Hilltop luxury, spa excellence
- **Park Hyatt Zürich**: Modern elegance, city center

**🚤 Exclusive Experiences**:
- **Private Lake Zürich Cruise**: Champagne sunset tours
- **Helicopter City Tours**: Aerial views of Alps and city
- **Limmat River Dining**: Floating restaurant experiences

**🍷 Wine & Spirits**:
- **Lavaux Wine Tours**: UNESCO vineyard day trips
- **Whisky Tastings**: Private distillery experiences
- **Champagne Bars**: Rooftop celebrations

**💰 Luxury Budget**: CHF 500-1,500 per person per day
**🎯 Best Districts**: Enge, Seefeld, Altstadt

*Which aspect of Zürich luxury appeals to you most?* 🇨🇭✨`;
        }
        
        // Enhanced keyword matching for better responses
        
        // Greeting responses
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('grüezi') || lowerMessage.includes('hey')) {
            return `🇨🇭 **Grüezi and welcome to SwissMate!**

I'm delighted you're here! I'm your personal Swiss travel concierge, ready to help you discover the magic of Switzerland.

✨ **What can I help you with today?**
- Plan a custom Swiss itinerary
- Recommend luxury destinations
- Suggest authentic Swiss experiences
- Find the best restaurants and cuisine
- Book scenic train journeys
- Discover hidden Swiss gems

Just tell me what interests you most about Switzerland, and I'll craft the perfect recommendations for your Alpine adventure!

*Was darf es sein?* (What would you like?) 🏔️`;
        }

        // Planning and itinerary requests
        if (lowerMessage.includes('plan') || lowerMessage.includes('itinerary') || lowerMessage.includes('trip') || lowerMessage.includes('visit') || lowerMessage.includes('travel')) {
            return `📅 **Swiss Itinerary Planning - Let's Create Your Perfect Journey!**

I'd love to help you plan an unforgettable Swiss adventure! Here are some questions to get started:

🗓️ **How long is your trip?** (3 days, 1 week, 2 weeks?)
🎯 **What's your travel style?** (Luxury, adventure, cultural, relaxation?)
🏔️ **Which regions interest you most?**
- **Central Switzerland**: Lucerne, Interlaken, Jungfraujoch
- **Valais**: Zermatt, Matterhorn, Saas-Fee
- **Grisons**: St. Moritz, Davos, Engadin Valley
- **Urban**: Zürich, Geneva, Basel, Bern

⭐ **Sample 7-Day Luxury Itinerary**:
Day 1-2: Zürich (city culture + Rhine Falls)
Day 3-4: Lucerne (Mount Pilatus + lake cruises)
Day 5-7: Zermatt (Matterhorn + Alpine adventures)

Tell me more about your preferences, and I'll create a personalized itinerary just for you!`;
        }

        // Weather and timing questions
        if (lowerMessage.includes('weather') || lowerMessage.includes('season') || lowerMessage.includes('when') || lowerMessage.includes('best time')) {
            return `🌤️ **Swiss Weather & Best Times to Visit**

Switzerland is beautiful year-round, but here's when to visit for different experiences:

❄️ **Winter (Dec-Mar)**:
- Perfect for skiing and winter sports
- Christmas markets and cozy mountain lodges
- Temperatures: -5°C to 5°C (23°F to 41°F)
- Best for: Zermatt, St. Moritz, Verbier

🌸 **Spring (Apr-May)**:
- Mild weather, fewer crowds
- Alpine flowers blooming
- Temperatures: 5°C to 15°C (41°F to 59°F)
- Best for: City visits, light hiking

☀️ **Summer (Jun-Aug)**:
- Peak hiking and outdoor activities
- All mountain lifts operating
- Temperatures: 15°C to 25°C (59°F to 77°F)
- Best for: Alpine adventures, festivals

🍂 **Autumn (Sep-Nov)**:
- Golden landscapes, harvest season
- Excellent weather for hiking
- Temperatures: 5°C to 20°C (41°F to 68°F)
- Best for: Wine tours, cultural visits

*When are you planning to visit?* I can give more specific recommendations!`;
        }

        // Cost and budget questions
        if (lowerMessage.includes('cost') || lowerMessage.includes('price') || lowerMessage.includes('budget') || lowerMessage.includes('expensive') || lowerMessage.includes('cheap')) {
            return `💰 **Swiss Travel Budget Guide**

Switzerland is known for quality, and here's what to expect:

🏨 **Accommodation (per night)**:
- Luxury Hotels: CHF 400-800+ (4-5 star)
- Mid-range Hotels: CHF 150-400 (3 star)
- Budget Options: CHF 80-150 (hostels/pensions)

🍽️ **Dining**:
- Fine Dining: CHF 80-150 per person
- Mid-range Restaurant: CHF 25-50 per person
- Casual Dining: CHF 15-30 per person
- McDonald's Meal: CHF 12-15

🚄 **Transportation**:
- Swiss Travel Pass: CHF 272 (4 days) to CHF 669 (1 month)
- Single Train Tickets: CHF 20-80 depending on distance
- City Transport: CHF 3-5 per journey

💡 **Money-Saving Tips**:
- Get Swiss Travel Pass for unlimited transport
- Eat lunch at mountain restaurants (often cheaper)
- Stay in valley towns, commute to mountains
- Shop at Coop/Migros supermarkets

**Daily Budget Estimates**:
- Luxury: CHF 500-800 per day
- Mid-range: CHF 200-350 per day
- Budget: CHF 100-200 per day

What's your budget range? I can tailor recommendations accordingly!`;
        }

        // Transportation questions
        if (lowerMessage.includes('transport') || lowerMessage.includes('train') || lowerMessage.includes('railway') || lowerMessage.includes('car') || lowerMessage.includes('travel pass')) {
            return `🚄 **Swiss Transportation - Efficient & Scenic!**

Switzerland has the world's best public transport system:

🎫 **Swiss Travel Pass** (Highly Recommended!):
- Unlimited trains, buses, boats
- Free museum entries (500+ locations)
- 50% discount on most mountain lifts
- Free city transport in 90+ towns

🌟 **Scenic Train Routes**:
- **Glacier Express**: St. Moritz ↔ Zermatt (8 hours)
- **Bernina Express**: Chur ↔ Tirano (4 hours)
- **Golden Pass**: Montreux ↔ Lucerne (5.5 hours)
- **GoldenPass Belle Époque**: Vintage luxury trains

🚗 **Driving in Switzerland**:
- Excellent roads but expensive parking
- Vignette required (CHF 40/year)
- Many mountain passes closed in winter
- Car-free destinations: Zermatt, Wengen, Mürren

🚁 **Helicopter Tours**:
- Matterhorn tours: CHF 300-600 per person
- Jungfraujoch flights: CHF 400-800 per person

⚡ **Swiss Efficiency**:
- Trains run every 30 minutes on main routes
- 99.7% punctuality rate
- Real-time apps: SBB Mobile, Swiss Travel Guide

Need help planning your transport route? Tell me your destinations!`;
        }

        // Destination-specific responses
        if (lowerMessage.includes('zermatt') || lowerMessage.includes('matterhorn')) {
            return `🏔️ **Zermatt & Matterhorn** - Absolutely magnificent choice! 

Zermatt is home to the iconic Matterhorn (4,478m) and offers world-class experiences:

🎿 **Winter Activities**: Skiing on 360km of slopes, snow hiking, ice climbing
🥾 **Summer Adventures**: Hiking the Matterhorn trail, Gornergrat railway, mountain biking
🏨 **Luxury Stays**: Grand Hotel Zermatterhof, The Omnia, Mont Cervin Palace
🍽️ **Fine Dining**: After Seven (14 GaultMillau points), Cervo Puro, Restaurant Whymper-Stube

**Getting There**: Take the scenic train from Visp to Zermatt (car-free village!)
**Best Time**: December-April for skiing, June-October for hiking

*Grüezi!* Would you like specific recommendations for activities or accommodations?`;
        }
        
        if (lowerMessage.includes('zurich') || lowerMessage.includes('zürich')) {
            return `🏙️ **Zürich - Swiss Sophistication at its Finest!**

Switzerland's largest city perfectly blends cosmopolitan luxury with Swiss charm:

🛍️ **Luxury Shopping**: Bahnhofstrasse (world's most expensive shopping street), Jelmoli
🎨 **Culture**: Kunsthaus Zürich, Opera House, Museum of Fine Arts
🍽️ **Michelin Dining**: The Restaurant (2 Michelin stars), Pavillon, Kronenhalle
🏨 **Premium Hotels**: Baur au Lac, The Dolder Grand, Park Hyatt Zürich

**Day Trip Ideas**: 
- Rhine Falls (30 mins by train)
- Lucerne & Mount Pilatus (1 hour)
- Wine tasting in Lavaux vineyards

**Swiss Tip**: Get the Zürich Card for free public transport and museum entries!

*Merci* for choosing Zürich! What specific experiences interest you most?`;
        }

        if (lowerMessage.includes('interlaken')) {
            return `🪂 **Interlaken - Adventure Capital of Switzerland!**

Nestled between Lakes Thun and Brienz, Interlaken is pure adventure:

🪂 **Extreme Sports**: Paragliding, skydiving, bungee jumping, canyoning
🚠 **Mountain Excursions**: Jungfraujoch "Top of Europe", Harder Kulm, Schilthorn
🚢 **Lake Activities**: Boat cruises, paddleboarding, swimming in crystal-clear waters
🎿 **Nearby Skiing**: Grindelwald, Wengen, Mürren (winter paradise!)

**Premium Experiences**:
- Helicopter tours over the Alps
- Private yacht on Lake Thun
- Exclusive mountain dining at Piz Gloria

**Adventure Packages**: From CHF 150/day for activities
**Luxury Stays**: Victoria Jungfrau Grand Hotel & Spa, Hotel Interlaken

Ready for the ultimate Swiss adventure? What thrills are you seeking?`;
        }

        // Activity-specific responses
        if (lowerMessage.includes('food') || lowerMessage.includes('cuisine') || lowerMessage.includes('restaurant')) {
            return `🧀 **Swiss Culinary Excellence - A Feast for the Senses!**

Switzerland's cuisine is far more than fondue (though our fondue is world-class!):

🫕 **Traditional Specialties**:
- **Fondue**: Gruyère & Emmental blend with white wine
- **Raclette**: Melted cheese over potatoes, pickles, onions
- **Rösti**: Crispy potato pancakes (Swiss soul food!)
- **Zürcher Geschnetzeltes**: Veal in cream sauce

🍫 **Swiss Chocolate**: Lindt, Läderach, Sprüngli - pure heaven!
🧀 **Artisan Cheeses**: 400+ varieties, from Appenzeller to Tête de Moine

**Michelin-Starred Experiences**:
- Restaurant de l'Hôtel de Ville (Crissier) - 3 Stars
- Schauenstein (Fürstenau) - 3 Stars
- The Restaurant (Zürich) - 2 Stars

**Wine Regions**: Lavaux, Valais, Ticino - stunning vineyard terraces!

*Bon appétit!* Which Swiss flavors are calling to you?`;
        }

        if (lowerMessage.includes('train') || lowerMessage.includes('railway')) {
            return `🚄 **Swiss Railways - The Ultimate Scenic Journey!**

Switzerland's train system is legendary for precision and breathtaking views:

🌟 **Panoramic Routes**:
- **Glacier Express**: St. Moritz to Zermatt (8 hours of Alpine majesty)
- **Bernina Express**: UNESCO World Heritage route with 196 bridges
- **Golden Pass Line**: Montreux to Lucerne through diverse landscapes
- **Gotthard Panorama Express**: Boat + train combination

🎫 **Swiss Travel Pass**: Unlimited travel + free museum entry
💺 **Excellence Class**: Premium service with gourmet dining onboard
⏰ **Swiss Punctuality**: 99.7% on-time performance!

**Insider Tip**: Book panoramic cars in advance for the best views!
**Duration**: Full scenic routes take 6-8 hours
**Cost**: From CHF 152 for regional passes

*All aboard!* Which scenic route captures your imagination?`;
        }

        // General Swiss travel response
        return `🇨🇭 **Grüezi! Welcome to SwissMate's Unified AI Experience!**

I'm your premium Swiss travel concierge, combining advanced AI with deep Swiss expertise to craft your perfect Alpine adventure! Here's what makes Switzerland extraordinary:

🏔️ **Iconic Destinations**: Zermatt, Interlaken, Zürich, Geneva, Lucerne
🎿 **Year-Round Activities**: World-class skiing, hiking, scenic railways  
🧀 **Culinary Delights**: Fondue, raclette, Swiss chocolate, fine wines
⌚ **Swiss Excellence**: Precision, quality, and legendary hospitality

**🤖 AI-Powered Features**:
- Instant personalized recommendations
- Real-time travel advice
- Multilingual support (German, French, Italian, English)
- Context-aware responses

**Popular Experiences**:
- Matterhorn glacier paradise
- Jungfraujoch "Top of Europe"
- Scenic train journeys
- Luxury spa retreats
- Cultural city breaks

**Travel Tips**:
- Swiss Travel Pass for unlimited transport
- Book mountain railways in advance
- Pack layers for changing Alpine weather

*Was kann ich für Sie tun?* (What can I do for you?)
Ask me about destinations, activities, dining, or custom itineraries!`;
    }

    addMessage(message, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        
        if (sender === 'bot') {
            avatar.innerHTML = `
                <div class="avatar-glow"></div>
                <i class="fas fa-robot"></i>
            `;
        } else {
            avatar.innerHTML = `<i class="fas fa-user"></i>`;
            avatar.style.background = 'linear-gradient(45deg, #FFD700, #FFA500)';
            avatar.style.color = '#000';
        }
        
        const content = document.createElement('div');
        content.className = 'message-content';
        content.innerHTML = `<p>${this.formatMessage(message)}</p>`;
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    formatMessage(message) {
        // Convert markdown-style formatting to HTML
        return message
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/🏔️|🎿|🧀|🍫|🚄|🇨🇭|🪂|🏙️|🛍️|🎨|🍽️|🏨|🚠|🚢|🫕|⌚|🌟|🎫|💺|⏰/g, '<span style="font-size: 1.2em;">$&</span>')
            .replace(/\n/g, '<br>');
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    showLoading(show) {
        if (show) {
            this.loadingSpinner.style.display = 'flex';
            this.scrollToBottom();
        } else {
            this.loadingSpinner.style.display = 'none';
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : '#2196F3'};
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            z-index: 10000;
            font-weight: 600;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    generateSessionId() {
        return 'swissmate_' + Math.random().toString(36).substr(2, 9);
    }
}

// Hero Banner Functions
function scrollToChat() {
    const chatSection = document.getElementById('chat-section');
    if (chatSection) {
        chatSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function scrollToDestinations() {
    const destinationsSection = document.getElementById('destinations-section');
    if (destinationsSection) {
        destinationsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Scroll to Top Function
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Initialize scroll-to-top button
function initScrollToTop() {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    if (scrollToTopBtn) {
        // Show/hide scroll to top button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });
    }
}

// Initialize animations
function initAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe heritage cards
    const heritageCards = document.querySelectorAll('.heritage-card');
    heritageCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });

    // Observe destination cards
    const destinationCards = document.querySelectorAll('.destination-premium');
    destinationCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });

    // Add animate-in class when observed
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

// Quick message sender for sample buttons
function sendSampleMessage(message) {
    if (window.swissMate) {
        window.swissMate.sendMessage(message);
        
        // Hide sample messages after first interaction
        const sampleMessages = document.querySelector('.sample-messages');
        if (sampleMessages) {
            sampleMessages.style.opacity = '0';
            sampleMessages.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                sampleMessages.style.display = 'none';
            }, 300);
        }
    }
}

// Quick message sender
function sendQuickMessage(message) {
    if (window.swissMate) {
        window.swissMate.sendMessage(message);
    }
}

// Send message function
function sendMessage() {
    if (window.swissMate) {
        window.swissMate.sendMessage();
    }
}

// Configuration functions
function saveConfiguration() {
    if (window.swissMate) {
        window.swissMate.saveConfiguration();
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize SwissMate
    window.swissMate = new SwissMate();
    
    // Initialize scroll-to-top button
    initScrollToTop();
    
    // Initialize animations
    initAnimations();
    
    // Add smooth scrolling for hero buttons
    const heroButtons = document.querySelectorAll('.hero-btn');
    heroButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Add ripple effect
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add hover effects for suggestion cards
    const suggestionCards = document.querySelectorAll('.suggestion-card');
    suggestionCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    console.log('🇨🇭 SwissMate unified chat experience initialized successfully! Grüezi!');
});

// Add ripple effect styles
const rippleStyles = document.createElement('style');
rippleStyles.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyles);
